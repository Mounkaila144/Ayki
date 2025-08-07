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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const company_entity_1 = require("../../entities/company.entity");
const job_offer_entity_1 = require("../../entities/job-offer.entity");
const application_entity_1 = require("../../entities/application.entity");
const interview_entity_1 = require("../../entities/interview.entity");
let AdminService = class AdminService {
    userRepository;
    profileRepository;
    companyRepository;
    jobOfferRepository;
    applicationRepository;
    interviewRepository;
    constructor(userRepository, profileRepository, companyRepository, jobOfferRepository, applicationRepository, interviewRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.companyRepository = companyRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }
    async getDashboardStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const totalCandidates = await this.userRepository.count({
            where: { userType: user_entity_1.UserType.CANDIDATE }
        });
        const totalRecruiters = await this.userRepository.count({
            where: { userType: user_entity_1.UserType.RECRUITER }
        });
        const activeUsers = await this.userRepository.count({
            where: { status: user_entity_1.UserStatus.ACTIVE }
        });
        const inactiveUsers = await this.userRepository.count({
            where: { status: user_entity_1.UserStatus.INACTIVE }
        });
        const newUsersThisMonth = await this.userRepository
            .createQueryBuilder('user')
            .where('user.createdAt >= :startOfMonth', { startOfMonth })
            .getCount();
        const recentLogins = await this.userRepository
            .createQueryBuilder('user')
            .where('user.lastLoginAt >= :sevenDaysAgo', { sevenDaysAgo })
            .andWhere('user.lastLoginAt IS NOT NULL')
            .getCount();
        const totalJobOffers = await this.jobOfferRepository.count();
        const totalApplications = await this.applicationRepository.count();
        const applicationsThisMonth = await this.applicationRepository
            .createQueryBuilder('application')
            .where('application.createdAt >= :startOfMonth', { startOfMonth })
            .getCount();
        const scheduledInterviews = await this.interviewRepository
            .createQueryBuilder('interview')
            .where('interview.status = :status', { status: 'scheduled' })
            .getCount();
        const candidateProfiles = await this.profileRepository
            .createQueryBuilder('profile')
            .innerJoin('profile.user', 'user')
            .where('user.userType = :userType', { userType: user_entity_1.UserType.CANDIDATE })
            .select('AVG(profile.profileCompletion)', 'avgCompletion')
            .getRawOne();
        const recruiterProfiles = await this.profileRepository
            .createQueryBuilder('profile')
            .innerJoin('profile.user', 'user')
            .where('user.userType = :userType', { userType: user_entity_1.UserType.RECRUITER })
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
    async getUsers(filters, pagination) {
        const queryBuilder = this.createUserQueryBuilder(filters);
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const offset = (page - 1) * limit;
        queryBuilder
            .skip(offset)
            .take(limit)
            .orderBy(`user.${pagination.sortBy}`, pagination.sortOrder);
        const [users, total] = await queryBuilder.getManyAndCount();
        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCandidates(filters, pagination) {
        const candidateFilters = { ...filters, userType: user_entity_1.UserType.CANDIDATE };
        return this.getUsers(candidateFilters, pagination);
    }
    async getRecruiters(filters, pagination) {
        const recruiterFilters = { ...filters, userType: user_entity_1.UserType.RECRUITER };
        return this.getUsers(recruiterFilters, pagination);
    }
    async getUserById(id) {
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
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateUserStatus(id, updateDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.userRepository.update(id, { status: updateDto.status });
        return this.getUserById(id);
    }
    async deleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.userRepository.update(id, { status: user_entity_1.UserStatus.INACTIVE });
        return { message: 'Utilisateur supprimé avec succès' };
    }
    createUserQueryBuilder(filters) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.company', 'company');
        if (filters.userType) {
            queryBuilder.andWhere('user.userType = :userType', { userType: filters.userType });
        }
        if (filters.status) {
            queryBuilder.andWhere('user.status = :status', { status: filters.status });
        }
        if (filters.search) {
            queryBuilder.andWhere('(profile.firstName ILIKE :search OR profile.lastName ILIKE :search OR user.phone ILIKE :search OR company.name ILIKE :search)', { search: `%${filters.search}%` });
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
            }
            else {
                queryBuilder.andWhere('user.emailVerifiedAt IS NULL');
            }
        }
        if (filters.phoneVerified !== undefined) {
            if (filters.phoneVerified) {
                queryBuilder.andWhere('user.phoneVerifiedAt IS NOT NULL');
            }
            else {
                queryBuilder.andWhere('user.phoneVerifiedAt IS NULL');
            }
        }
        return queryBuilder;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(3, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(4, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(5, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map