import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { JobOffer } from '../../entities/job-offer.entity';
import { Application } from '../../entities/application.entity';
import { Interview } from '../../entities/interview.entity';
import { AdminDashboardStatsDto } from './dto/admin-dashboard-stats.dto';
import { AdminUserFilterDto } from './dto/admin-user-filter.dto';
import { AdminPaginationDto } from './dto/admin-pagination.dto';
import { AdminUpdateUserStatusDto } from './dto/admin-update-user-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
  ) {}

  async getDashboardStats(): Promise<AdminDashboardStatsDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Compter les utilisateurs par type
    const totalCandidates = await this.userRepository.count({
      where: { userType: UserType.CANDIDATE }
    });

    const totalRecruiters = await this.userRepository.count({
      where: { userType: UserType.RECRUITER }
    });

    // Compter les utilisateurs par statut
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE }
    });

    const inactiveUsers = await this.userRepository.count({
      where: { status: UserStatus.INACTIVE }
    });

    // Nouvelles inscriptions ce mois
    const newUsersThisMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startOfMonth', { startOfMonth })
      .getCount();

    // Connexions récentes
    const recentLogins = await this.userRepository
      .createQueryBuilder('user')
      .where('user.lastLoginAt >= :sevenDaysAgo', { sevenDaysAgo })
      .andWhere('user.lastLoginAt IS NOT NULL')
      .getCount();

    // Statistiques des offres d'emploi
    const totalJobOffers = await this.jobOfferRepository.count();

    // Statistiques des candidatures
    const totalApplications = await this.applicationRepository.count();
    const applicationsThisMonth = await this.applicationRepository
      .createQueryBuilder('application')
      .where('application.createdAt >= :startOfMonth', { startOfMonth })
      .getCount();

    // Entretiens programmés
    const scheduledInterviews = await this.interviewRepository
      .createQueryBuilder('interview')
      .where('interview.status = :status', { status: 'scheduled' })
      .getCount();

    // Calcul des taux de complétion des profils
    const candidateProfiles = await this.profileRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.user', 'user')
      .where('user.userType = :userType', { userType: UserType.CANDIDATE })
      .select('AVG(profile.profileCompletion)', 'avgCompletion')
      .getRawOne();

    const recruiterProfiles = await this.profileRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.user', 'user')
      .where('user.userType = :userType', { userType: UserType.RECRUITER })
      .select('AVG(profile.profileCompletion)', 'avgCompletion')
      .getRawOne();

    return {
      totalCandidates,
      totalRecruiters,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      recentLogins,
      totalJobOffers,
      totalApplications,
      applicationsThisMonth,
      scheduledInterviews,
      candidateProfileCompletion: Math.round(candidateProfiles?.avgCompletion || 0),
      recruiterProfileCompletion: Math.round(recruiterProfiles?.avgCompletion || 0),
    };
  }

  async getUsers(
    filters: AdminUserFilterDto,
    pagination: AdminPaginationDto,
  ) {
    const queryBuilder = this.createUserQueryBuilder(filters);
    
    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const offset = (page - 1) * limit;
    queryBuilder
      .skip(offset)
      .take(limit)
      .orderBy(`user.${pagination.sortBy}`, pagination.sortOrder);

    // Get results and total count
    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCandidates(
    filters: AdminUserFilterDto,
    pagination: AdminPaginationDto,
  ) {
    const candidateFilters = { ...filters, userType: UserType.CANDIDATE };
    return this.getUsers(candidateFilters, pagination);
  }

  async getRecruiters(
    filters: AdminUserFilterDto,
    pagination: AdminPaginationDto,
  ) {
    const recruiterFilters = { ...filters, userType: UserType.RECRUITER };
    return this.getUsers(recruiterFilters, pagination);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'profile',
        'company',
        'experiences',
        'educations',
        'skills',
        'documents',
        'applications',
        'jobOffers'
      ],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async updateUserStatus(id: string, updateDto: AdminUpdateUserStatusDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.userRepository.update(id, { status: updateDto.status });
    
    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Soft delete - change status to inactive instead of hard delete
    await this.userRepository.update(id, { status: UserStatus.INACTIVE });
    
    return { message: 'Utilisateur supprimé avec succès' };
  }

  private createUserQueryBuilder(filters: AdminUserFilterDto): SelectQueryBuilder<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.company', 'company');

    // Apply filters
    if (filters.userType) {
      queryBuilder.andWhere('user.userType = :userType', { userType: filters.userType });
    }

    if (filters.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(profile.firstName ILIKE :search OR profile.lastName ILIKE :search OR user.phone ILIKE :search OR company.name ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.location) {
      queryBuilder.andWhere('profile.location ILIKE :location', { 
        location: `%${filters.location}%` 
      });
    }

    if (filters.company) {
      queryBuilder.andWhere('company.name ILIKE :company', { 
        company: `%${filters.company}%` 
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', { 
        startDate: filters.startDate 
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('user.createdAt <= :endDate', { 
        endDate: filters.endDate 
      });
    }

    if (filters.emailVerified !== undefined) {
      if (filters.emailVerified) {
        queryBuilder.andWhere('user.emailVerifiedAt IS NOT NULL');
      } else {
        queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
      }
    }

    if (filters.phoneVerified !== undefined) {
      if (filters.phoneVerified) {
        queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
      } else {
        queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
      }
    }

    return queryBuilder;
  }
}
