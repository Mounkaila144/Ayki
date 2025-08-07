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
exports.RecruitersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const user_skill_entity_1 = require("../../entities/user-skill.entity");
const experience_entity_1 = require("../../entities/experience.entity");
const education_entity_1 = require("../../entities/education.entity");
const application_entity_1 = require("../../entities/application.entity");
const bookmark_entity_1 = require("../../entities/bookmark.entity");
let RecruitersService = class RecruitersService {
    userRepository;
    profileRepository;
    userSkillRepository;
    experienceRepository;
    educationRepository;
    applicationRepository;
    bookmarkRepository;
    constructor(userRepository, profileRepository, userSkillRepository, experienceRepository, educationRepository, applicationRepository, bookmarkRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.userSkillRepository = userSkillRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.applicationRepository = applicationRepository;
        this.bookmarkRepository = bookmarkRepository;
    }
    async getRecruiterStats(recruiterId) {
        try {
            const totalCandidates = await this.userRepository.count({
                where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.ACTIVE }
            });
            const bookmarkedCandidates = await this.bookmarkRepository.count({
                where: { recruiterId: recruiterId }
            });
            return {
                totalCandidates,
                bookmarkedCandidates,
                activeJobOffers: 0,
                totalApplications: 0,
                interviewsScheduled: 0,
                hiredCandidates: 0,
            };
        }
        catch (error) {
            console.error('Error getting recruiter stats:', error);
            return {
                totalCandidates: 0,
                bookmarkedCandidates: 0,
                activeJobOffers: 0,
                totalApplications: 0,
                interviewsScheduled: 0,
                hiredCandidates: 0,
            };
        }
    }
    async searchCandidates(recruiterId, filters) {
        try {
            console.log('=== SEARCH CANDIDATES START ===');
            console.log('Recruiter ID:', recruiterId);
            console.log('Filters received:', filters);
            const { search = '', location = '', skills = '', experience = '', sortBy = 'lastActive', sortOrder = 'desc', page = 1, limit = 12 } = filters;
            const totalCandidates = await this.userRepository.count({
                where: { userType: user_entity_1.UserType.CANDIDATE, status: user_entity_1.UserStatus.ACTIVE }
            });
            console.log('Total active candidates in database:', totalCandidates);
            const queryBuilder = this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profile', 'profile')
                .leftJoinAndSelect('user.skills', 'skills')
                .leftJoinAndSelect('user.experiences', 'experiences')
                .leftJoinAndSelect('user.educations', 'educations')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.CANDIDATE })
                .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
            if (search) {
                queryBuilder.andWhere('(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.title LIKE :search)', { search: `%${search}%` });
            }
            if (location) {
                queryBuilder.andWhere('profile.location LIKE :location', { location: `%${location}%` });
            }
            if (skills) {
                const skillsArray = skills.split(',').map((s) => s.trim());
                queryBuilder.andWhere('skills.name IN (:...skills)', { skills: skillsArray });
            }
            switch (sortBy) {
                case 'name':
                    queryBuilder.orderBy('profile.firstName', sortOrder.toUpperCase());
                    break;
                case 'experience':
                    queryBuilder.orderBy('profile.yearsOfExperience', sortOrder.toUpperCase());
                    break;
                case 'lastActive':
                default:
                    queryBuilder.orderBy('user.updatedAt', sortOrder.toUpperCase());
                    break;
            }
            const offset = (page - 1) * limit;
            queryBuilder.skip(offset).take(limit);
            console.log('Generated SQL:', queryBuilder.getSql());
            const [users, total] = await queryBuilder.getManyAndCount();
            console.log('Users found:', users.length);
            console.log('Total count:', total);
            if (users.length > 0) {
                console.log('First user sample:', {
                    id: users[0].id,
                    userType: users[0].userType,
                    hasProfile: !!users[0].profile,
                    profileData: users[0].profile
                });
            }
            const candidates = users.map(user => this.transformUserToCandidate(user));
            console.log('Candidates after transformation:', candidates.length);
            const result = {
                data: candidates,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit),
                limit: parseInt(limit)
            };
            console.log('=== SEARCH CANDIDATES END ===');
            console.log('Result:', result);
            return result;
        }
        catch (error) {
            console.error('Error searching candidates:', error);
            throw error;
        }
    }
    async getBookmarkedCandidates(recruiterId) {
        try {
            const bookmarks = await this.bookmarkRepository.find({
                where: { recruiterId: recruiterId },
                relations: ['candidate', 'candidate.profile', 'candidate.skills']
            });
            return bookmarks.map(bookmark => this.transformUserToCandidate(bookmark.candidate));
        }
        catch (error) {
            console.error('Error getting bookmarked candidates:', error);
            return [];
        }
    }
    async toggleCandidateBookmark(recruiterId, candidateId) {
        try {
            const candidate = await this.userRepository.findOne({
                where: { id: candidateId, userType: user_entity_1.UserType.CANDIDATE }
            });
            if (!candidate) {
                throw new common_1.NotFoundException('Candidat non trouvé');
            }
            const existingBookmark = await this.bookmarkRepository.findOne({
                where: { recruiterId: recruiterId, candidateId: candidateId }
            });
            if (existingBookmark) {
                await this.bookmarkRepository.remove(existingBookmark);
                return { bookmarked: false, message: 'Candidat retiré des favoris' };
            }
            else {
                const bookmark = this.bookmarkRepository.create({
                    recruiterId: recruiterId,
                    candidateId: candidateId,
                    type: bookmark_entity_1.BookmarkType.CANDIDATE
                });
                await this.bookmarkRepository.save(bookmark);
                return { bookmarked: true, message: 'Candidat ajouté aux favoris' };
            }
        }
        catch (error) {
            console.error('Error toggling candidate bookmark:', error);
            throw error;
        }
    }
    async getCandidateProfile(recruiterId, candidateId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: candidateId, userType: user_entity_1.UserType.CANDIDATE },
                relations: [
                    'profile',
                    'skills',
                    'experiences',
                    'educations',
                    'documents'
                ]
            });
            if (!user) {
                throw new common_1.NotFoundException('Candidat non trouvé');
            }
            return this.transformUserToCandidate(user, true);
        }
        catch (error) {
            console.error('Error getting candidate profile:', error);
            throw error;
        }
    }
    transformUserToCandidate(user, detailed = false) {
        const profile = user.profile;
        const skills = user.skills?.map(skill => skill.name).filter(Boolean) || [];
        const latestExperience = user.experiences?.[0];
        const latestEducation = user.educations?.[0];
        const baseData = {
            id: user.id,
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            title: profile?.title || 'Non spécifié',
            location: profile?.location || 'Non spécifié',
            summary: profile?.summary || profile?.bio || 'Aucune description disponible',
            skills,
            experience: profile?.yearsOfExperience ? `${profile.yearsOfExperience} ans` : 'Non spécifié',
            avatar: profile?.avatar || null,
            salary: profile?.salaryExpectation || 'Non spécifié',
            availability: this.getAvailabilityLabel(profile?.availability),
            rating: profile?.rating || null,
            lastActive: this.getLastActiveLabel(user.updatedAt),
            education: latestEducation?.degree || 'Non spécifié',
            company: latestExperience?.company || 'Non spécifié',
            isBookmarked: false,
            matchScore: Math.floor(Math.random() * 30) + 70,
            profileCompletion: profile?.profileCompletion || 0,
        };
        if (detailed) {
            return {
                ...baseData,
                email: profile?.email || '',
                phone: user.phone || '',
                experiences: user.experiences || [],
                educations: user.educations || [],
                documents: user.documents || [],
            };
        }
        return baseData;
    }
    getAvailabilityLabel(availability) {
        const labels = {
            'immediate': 'Immédiate',
            'one_week': '1 semaine',
            'two_weeks': '2 semaines',
            'one_month': '1 mois',
            'two_months': '2 mois',
            'three_months': '3 mois',
            'not_available': 'Non disponible'
        };
        return labels[availability] || 'Non spécifié';
    }
    getLastActiveLabel(updatedAt) {
        const now = new Date();
        const diff = now.getTime() - updatedAt.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1)
            return 'maintenant';
        if (hours < 24)
            return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30)
            return `${days}j`;
        const months = Math.floor(days / 30);
        return `${months}m`;
    }
};
exports.RecruitersService = RecruitersService;
exports.RecruitersService = RecruitersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(user_skill_entity_1.UserSkill)),
    __param(3, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(4, (0, typeorm_1.InjectRepository)(education_entity_1.Education)),
    __param(5, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(6, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RecruitersService);
//# sourceMappingURL=recruiters.service.js.map