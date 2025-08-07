import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { JobOffer } from '../../entities/job-offer.entity';

export interface SimpleAdminUserFilter {
  status?: string;
  search?: string;
  location?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface SimpleAdminPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class SimpleAdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
  ) {}

  async getDashboardStats() {
    try {
      const [
        totalCandidates,
        totalRecruiters,
        activeCandidates,
        activeRecruiters,
        inactiveCandidates,
        inactiveRecruiters,
        suspendedCandidates,
        suspendedRecruiters,
        pendingCandidates,
        pendingRecruiters,
        verifiedEmails,
        verifiedPhones,
      ] = await Promise.all([
        this.userRepository.count({ where: { userType: UserType.CANDIDATE } }),
        this.userRepository.count({ where: { userType: UserType.RECRUITER } }),
        this.userRepository.count({ where: { userType: UserType.CANDIDATE, status: UserStatus.ACTIVE } }),
        this.userRepository.count({ where: { userType: UserType.RECRUITER, status: UserStatus.ACTIVE } }),
        this.userRepository.count({ where: { userType: UserType.CANDIDATE, status: UserStatus.INACTIVE } }),
        this.userRepository.count({ where: { userType: UserType.RECRUITER, status: UserStatus.INACTIVE } }),
        this.userRepository.count({ where: { userType: UserType.CANDIDATE, status: UserStatus.SUSPENDED } }),
        this.userRepository.count({ where: { userType: UserType.RECRUITER, status: UserStatus.SUSPENDED } }),
        this.userRepository.count({ where: { userType: UserType.CANDIDATE, status: UserStatus.PENDING } }),
        this.userRepository.count({ where: { userType: UserType.RECRUITER, status: UserStatus.PENDING } }),
        this.userRepository.createQueryBuilder('user').where('user.emailVerifiedAt IS NOT NULL').getCount(),
        this.userRepository.createQueryBuilder('user').where('user.phoneVerifiedAt IS NOT NULL').getCount(),
      ]);

      return {
        totalUsers: totalCandidates + totalRecruiters,
        totalCandidates,
        totalRecruiters,
        activeCandidates,
        activeRecruiters,
        inactiveCandidates,
        inactiveRecruiters,
        suspendedCandidates,
        suspendedRecruiters,
        pendingCandidates,
        pendingRecruiters,
        verifiedEmails,
        verifiedPhones,
        completionRate: 85, // Mock data
        averageRating: 4.2, // Mock data
        thisMonthSignups: 45, // Mock data
        lastWeekActivity: 128, // Mock data
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalUsers: 0,
        totalCandidates: 0,
        totalRecruiters: 0,
        activeCandidates: 0,
        activeRecruiters: 0,
        inactiveCandidates: 0,
        inactiveRecruiters: 0,
        suspendedCandidates: 0,
        suspendedRecruiters: 0,
        pendingCandidates: 0,
        pendingRecruiters: 0,
        verifiedEmails: 0,
        verifiedPhones: 0,
        completionRate: 0,
        averageRating: 0,
        thisMonthSignups: 0,
        lastWeekActivity: 0,
      };
    }
  }

  async getCandidates(filters: SimpleAdminUserFilter = {}, pagination: SimpleAdminPagination = {}) {
    try {
      const {
        status,
        search,
        location,
        startDate,
        endDate,
        emailVerified,
        phoneVerified,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = pagination;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.userType = :userType', { userType: UserType.CANDIDATE });

      // Apply filters
      if (status) {
        queryBuilder.andWhere('user.status = :status', { status });
      }

      if (search) {
        queryBuilder.andWhere(
          '(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.email LIKE :search OR user.phone LIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (location) {
        queryBuilder.andWhere('profile.location LIKE :location', { location: `%${location}%` });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      if (emailVerified !== undefined) {
        if (emailVerified) {
          queryBuilder.andWhere('user.emailVerifiedAt IS NOT NULL');
        } else {
          queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
        }
      }

      if (phoneVerified !== undefined) {
        if (phoneVerified) {
          queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
        } else {
          queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
        }
      }

      // Apply sorting
      const sortField = sortBy === 'createdAt' ? 'user.createdAt' : `profile.${sortBy}`;
      queryBuilder.orderBy(sortField, sortOrder);

      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [users, total] = await queryBuilder.getManyAndCount();

      return {
        data: users.map(user => ({
          id: user.id,
          phone: user.phone,
          userType: user.userType,
          status: user.status,
          emailVerifiedAt: user.emailVerifiedAt,
          phoneVerifiedAt: user.phoneVerifiedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          profile: user.profile ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            title: user.profile.title,
            location: user.profile.location,
            summary: user.profile.summary,
            profileCompletion: user.profile.profileCompletion || 0,
            profileViews: user.profile.profileViews || 0,
            rating: user.profile.rating || 0,
          } : null,
          company: user.company ? {
            name: user.company.name,
            logo: user.company.logo,
            website: user.company.website,
          } : null,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting candidates:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }
  }

  async getRecruiters(filters: SimpleAdminUserFilter = {}, pagination: SimpleAdminPagination = {}) {
    try {
      const {
        status,
        search,
        location,
        company,
        startDate,
        endDate,
        emailVerified,
        phoneVerified,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = pagination;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.userType = :userType', { userType: UserType.RECRUITER });

      // Apply filters (same as candidates)
      if (status) {
        queryBuilder.andWhere('user.status = :status', { status });
      }

      if (search) {
        queryBuilder.andWhere(
          '(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.email LIKE :search OR user.phone LIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (location) {
        queryBuilder.andWhere('profile.location LIKE :location', { location: `%${location}%` });
      }

      if (company) {
        queryBuilder.andWhere('company.name LIKE :company', { company: `%${company}%` });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      if (emailVerified !== undefined) {
        if (emailVerified) {
          queryBuilder.andWhere('user.emailVerifiedAt IS NOT NULL');
        } else {
          queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
        }
      }

      if (phoneVerified !== undefined) {
        if (phoneVerified) {
          queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
        } else {
          queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
        }
      }

      // Apply sorting
      const sortField = sortBy === 'createdAt' ? 'user.createdAt' : `profile.${sortBy}`;
      queryBuilder.orderBy(sortField, sortOrder);

      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [users, total] = await queryBuilder.getManyAndCount();

      return {
        data: users.map(user => ({
          id: user.id,
          phone: user.phone,
          userType: user.userType,
          status: user.status,
          emailVerifiedAt: user.emailVerifiedAt,
          phoneVerifiedAt: user.phoneVerifiedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          profile: user.profile ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            title: user.profile.title,
            location: user.profile.location,
            summary: user.profile.summary,
            profileCompletion: user.profile.profileCompletion || 0,
            profileViews: user.profile.profileViews || 0,
            rating: user.profile.rating || 0,
          } : null,
          company: user.company ? {
            name: user.company.name,
            logo: user.company.logo,
            website: user.company.website,
            jobOffersCount: 0, // Mock data
          } : null,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting recruiters:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['profile', 'company'],
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return {
        id: user.id,
        phone: user.phone,
        userType: user.userType,
        status: user.status,
        adminRole: user.adminRole,
        emailVerifiedAt: user.emailVerifiedAt,
        phoneVerifiedAt: user.phoneVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile ? {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          email: user.profile.email,
          title: user.profile.title,
          location: user.profile.location,
          summary: user.profile.summary,
          profileCompletion: user.profile.profileCompletion || 0,
          profileViews: user.profile.profileViews || 0,
          rating: user.profile.rating || 0,
        } : null,
        company: user.company ? {
          name: user.company.name,
          logo: user.company.logo,
          website: user.company.website,
        } : null,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async updateUserStatus(id: string, status: { status: string }) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      user.status = status.status as UserStatus;
      user.updatedAt = new Date();
      
      await this.userRepository.save(user);
      return { success: true, message: 'Statut mis à jour avec succès' };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Soft delete
      user.status = UserStatus.INACTIVE;
      user.updatedAt = new Date();
      
      await this.userRepository.save(user);
      return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Gestion des annonces administratives
  async getAllJobs(query: any = {}) {
    try {
      const { page = 1, limit = 10, isAdminPost } = query;
      
      const queryBuilder = this.jobOfferRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.recruiter', 'recruiter')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('job.applications', 'applications');

      if (isAdminPost !== undefined) {
        queryBuilder.andWhere('job.isAdminPost = :isAdminPost', { isAdminPost: isAdminPost === 'true' });
      }

      queryBuilder
        .orderBy('job.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      const [jobs, total] = await queryBuilder.getManyAndCount();

      return {
        data: jobs,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting all jobs:', error);
      throw error;
    }
  }

  async createAdminJob(adminId: string, createJobDto: any) {
    try {
      // Créer une annonce administrative sans companyId ni recruiterId
      const jobOffer = this.jobOfferRepository.create({
        ...createJobDto,
        isAdminPost: true,
        // Pour les annonces admin, on peut utiliser l'ID admin ou laisser null
        recruiterId: null,
        companyId: null,
        status: 'published', // Publier directement
      });

      return await this.jobOfferRepository.save(jobOffer);
    } catch (error) {
      console.error('Error creating admin job:', error);
      throw error;
    }
  }

  async updateAdminJob(id: string, updateJobDto: any) {
    try {
      const job = await this.jobOfferRepository.findOne({ 
        where: { id, isAdminPost: true } 
      });
      
      if (!job) {
        throw new NotFoundException('Annonce administrative non trouvée');
      }

      // Nettoyer les données de mise à jour
      const { companyId, recruiterId, isAdminPost, createdAt, updatedAt, ...cleanUpdateDto } = updateJobDto;

      await this.jobOfferRepository.update(id, cleanUpdateDto);
      return await this.jobOfferRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error updating admin job:', error);
      throw error;
    }
  }

  async deleteAdminJob(id: string) {
    try {
      const job = await this.jobOfferRepository.findOne({ 
        where: { id, isAdminPost: true } 
      });
      
      if (!job) {
        throw new NotFoundException('Annonce administrative non trouvée');
      }

      await this.jobOfferRepository.delete(id);
      return { success: true, message: 'Annonce administrative supprimée avec succès' };
    } catch (error) {
      console.error('Error deleting admin job:', error);
      throw error;
    }
  }

  // Gestion des annonces de recruteurs
  async updateRecruiterJob(id: string, updateJobDto: any) {
    try {
      const job = await this.jobOfferRepository.findOne({ 
        where: { id, isAdminPost: false } 
      });
      
      if (!job) {
        throw new NotFoundException('Annonce de recruteur non trouvée');
      }

      // Pour les annonces de recruteurs, on peut principalement modifier le statut
      const { companyId, recruiterId, isAdminPost, createdAt, updatedAt, ...cleanUpdateDto } = updateJobDto;

      await this.jobOfferRepository.update(id, cleanUpdateDto);
      return await this.jobOfferRepository.findOne({ 
        where: { id },
        relations: ['recruiter', 'company', 'recruiter.profile']
      });
    } catch (error) {
      console.error('Error updating recruiter job:', error);
      throw error;
    }
  }
}
