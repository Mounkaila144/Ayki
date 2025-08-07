"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const company_entity_1 = require("../../entities/company.entity");
const job_offer_entity_1 = require("../../entities/job-offer.entity");
let SimpleAdminService = class SimpleAdminService {
    userRepository;
    profileRepository;
    companyRepository;
    jobOfferRepository;
    constructor(userRepository, profileRepository, companyRepository, jobOfferRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.companyRepository = companyRepository;
        this.jobOfferRepository = jobOfferRepository;
    }
    async getDashboardStats() {
        try {
            const [totalCandidates, totalRecruiters, activeCandidates, activeRecruiters, inactiveCandidates, inactiveRecruiters, suspendedCandidates, suspendedRecruiters, pendingCandidates, pendingRecruiters, verifiedEmails, verifiedPhones,] = await Promise.all([
                this.userRepository.count({ where: { userType: user_entity_1.UserType.CANDIDATE } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.RECRUITER } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.ACTIVE } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.RECRUITER, status: user_entity_1.UserStatus.ACTIVE } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.INACTIVE } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.RECRUITER, status: user_entity_1.UserStatus.INACTIVE } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.SUSPENDED } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.RECRUITER, status: user_entity_1.UserStatus.SUSPENDED } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.PENDING } }),
                this.userRepository.count({ where: { userType: user_entity_1.UserType.RECRUITER, status: user_entity_1.UserStatus.PENDING } }),
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
                completionRate: 85,
                averageRating: 4.2,
                thisMonthSignups: 45,
                lastWeekActivity: 128,
            };
        }
        catch (error) {
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
    async getCandidates(filters = {}, pagination = {}) {
        try {
            const { status, search, location, startDate, endDate, emailVerified, phoneVerified, } = filters;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = pagination;
            const queryBuilder = this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profile', 'profile')
                .leftJoinAndSelect('user.company', 'company')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.CANDIDATE });
            if (status) {
                queryBuilder.andWhere('user.status = :status', { status });
            }
            if (search) {
                queryBuilder.andWhere('(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.email LIKE :search OR user.phone LIKE :search)', { search: `%${search}%` });
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
                }
                else {
                    queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
                }
            }
            if (phoneVerified !== undefined) {
                if (phoneVerified) {
                    queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
                }
                else {
                    queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
                }
            }
            const sortField = sortBy === 'createdAt' ? 'user.createdAt' : `profile.${sortBy}`;
            queryBuilder.orderBy(sortField, sortOrder);
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
        }
        catch (error) {
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
    async getRecruiters(filters = {}, pagination = {}) {
        try {
            const { status, search, location, company, startDate, endDate, emailVerified, phoneVerified, } = filters;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = pagination;
            const queryBuilder = this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profile', 'profile')
                .leftJoinAndSelect('user.company', 'company')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.RECRUITER });
            if (status) {
                queryBuilder.andWhere('user.status = :status', { status });
            }
            if (search) {
                queryBuilder.andWhere('(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.email LIKE :search OR user.phone LIKE :search)', { search: `%${search}%` });
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
                }
                else {
                    queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
                }
            }
            if (phoneVerified !== undefined) {
                if (phoneVerified) {
                    queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
                }
                else {
                    queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
                }
            }
            const sortField = sortBy === 'createdAt' ? 'user.createdAt' : `profile.${sortBy}`;
            queryBuilder.orderBy(sortField, sortOrder);
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
                        jobOffersCount: 0,
                    } : null,
                })),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
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
    async getUserById(id) {
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
        }
        catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }
    async updateUserStatus(id, status) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            user.status = status.status;
            user.updatedAt = new Date();
            await this.userRepository.save(user);
            return { success: true, message: 'Statut mis à jour avec succès' };
        }
        catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            user.status = user_entity_1.UserStatus.INACTIVE;
            user.updatedAt = new Date();
            await this.userRepository.save(user);
            return { success: true, message: 'Utilisateur supprimé avec succès' };
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
    async getAllJobs(query = {}) {
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
        }
        catch (error) {
            console.error('Error getting all jobs:', error);
            throw error;
        }
    }
    async createAdminJob(adminId, createJobDto) {
        try {
            const jobOffer = this.jobOfferRepository.create({
                ...createJobDto,
                isAdminPost: true,
                recruiterId: null,
                companyId: null,
                status: 'published',
            });
            return await this.jobOfferRepository.save(jobOffer);
        }
        catch (error) {
            console.error('Error creating admin job:', error);
            throw error;
        }
    }
    async updateAdminJob(id, updateJobDto) {
        try {
            const job = await this.jobOfferRepository.findOne({
                where: { id, isAdminPost: true }
            });
            if (!job) {
                throw new common_1.NotFoundException('Annonce administrative non trouvée');
            }
            const { companyId, recruiterId, isAdminPost, createdAt, updatedAt, ...cleanUpdateDto } = updateJobDto;
            await this.jobOfferRepository.update(id, cleanUpdateDto);
            return await this.jobOfferRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.error('Error updating admin job:', error);
            throw error;
        }
    }
    async deleteAdminJob(id) {
        try {
            const job = await this.jobOfferRepository.findOne({
                where: { id, isAdminPost: true }
            });
            if (!job) {
                throw new common_1.NotFoundException('Annonce administrative non trouvée');
            }
            await this.jobOfferRepository.delete(id);
            return { success: true, message: 'Annonce administrative supprimée avec succès' };
        }
        catch (error) {
            console.error('Error deleting admin job:', error);
            throw error;
        }
    }
    async updateRecruiterJob(id, updateJobDto) {
        try {
            const job = await this.jobOfferRepository.findOne({
                where: { id, isAdminPost: false }
            });
            if (!job) {
                throw new common_1.NotFoundException('Annonce de recruteur non trouvée');
            }
            const { companyId, recruiterId, isAdminPost, createdAt, updatedAt, ...cleanUpdateDto } = updateJobDto;
            await this.jobOfferRepository.update(id, cleanUpdateDto);
            return await this.jobOfferRepository.findOne({
                where: { id },
                relations: ['recruiter', 'company', 'recruiter.profile']
            });
        }
        catch (error) {
            console.error('Error updating recruiter job:', error);
            throw error;
        }
    }
};
exports.SimpleAdminService = SimpleAdminService;
exports.SimpleAdminService = SimpleAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(3, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SimpleAdminService);
//# sourceMappingURL=admin.service.simple.js.map