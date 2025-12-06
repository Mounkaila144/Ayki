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
const Fuse = require("fuse.js");
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
            console.log('=== ADVANCED SEARCH CANDIDATES START ===');
            console.log('Recruiter ID:', recruiterId);
            console.log('Filters received:', filters);
            const { search = '', location = '', skills = '', experience = '', sortBy = 'relevance', sortOrder = 'desc', page = 1, limit = 12 } = filters;
            const queryBuilder = this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profile', 'profile')
                .leftJoinAndSelect('user.skills', 'userSkills')
                .leftJoinAndSelect('userSkills.skill', 'skill')
                .leftJoinAndSelect('user.experiences', 'experiences')
                .leftJoinAndSelect('user.educations', 'educations')
                .leftJoinAndSelect('user.documents', 'documents')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.CANDIDATE })
                .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
            if (search && search.trim() !== '') {
                const searchTerm = `%${search.trim()}%`;
                queryBuilder.andWhere(new typeorm_2.Brackets((qb) => {
                    qb.where('profile.firstName LIKE :search', { search: searchTerm })
                        .orWhere('profile.lastName LIKE :search', { search: searchTerm })
                        .orWhere('profile.title LIKE :search', { search: searchTerm })
                        .orWhere('profile.summary LIKE :search', { search: searchTerm })
                        .orWhere('profile.bio LIKE :search', { search: searchTerm })
                        .orWhere('skill.name LIKE :search', { search: searchTerm })
                        .orWhere('experiences.title LIKE :search', { search: searchTerm })
                        .orWhere('experiences.company LIKE :search', { search: searchTerm })
                        .orWhere('experiences.description LIKE :search', { search: searchTerm })
                        .orWhere('experiences.industry LIKE :search', { search: searchTerm })
                        .orWhere('educations.degree LIKE :search', { search: searchTerm })
                        .orWhere('educations.school LIKE :search', { search: searchTerm })
                        .orWhere('educations.fieldOfStudy LIKE :search', { search: searchTerm })
                        .orWhere('educations.description LIKE :search', { search: searchTerm });
                }));
            }
            if (location && location.trim() !== '') {
                queryBuilder.andWhere('profile.location LIKE :location', {
                    location: `%${location.trim()}%`
                });
            }
            if (skills && skills.trim() !== '') {
                const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
                if (skillsArray.length > 0) {
                    queryBuilder.andWhere('skill.name IN (:...skillsList)', {
                        skillsList: skillsArray
                    });
                }
            }
            const users = await queryBuilder.getMany();
            console.log('Initial SQL results:', users.length);
            let scoredCandidates = users.map(user => ({
                user,
                score: 0,
                matchDetails: []
            }));
            if (search && search.trim() !== '') {
                const searchableData = users.map(user => {
                    const profile = user.profile || {};
                    const userSkills = user.skills?.map(us => us.skill?.name).filter(Boolean) || [];
                    const experiences = user.experiences || [];
                    const educations = user.educations || [];
                    return {
                        user,
                        searchableText: [
                            profile.firstName,
                            profile.lastName,
                            profile.title,
                            profile.summary,
                            profile.bio,
                            ...userSkills,
                            ...(profile.languages || []),
                            ...(profile.interests || []),
                            ...experiences.map(exp => [
                                exp.title,
                                exp.company,
                                exp.description,
                                ...(exp.technologies || []),
                                ...(exp.skills || []),
                                exp.industry
                            ]).flat(),
                            ...educations.map(edu => [
                                edu.degree,
                                edu.school,
                                edu.fieldOfStudy,
                                edu.description,
                                ...(edu.coursework || [])
                            ]).flat()
                        ].filter(Boolean).join(' ')
                    };
                });
                const FuseClass = Fuse.default || Fuse;
                const fuse = new FuseClass(searchableData, {
                    keys: ['searchableText'],
                    threshold: 0.4,
                    distance: 100,
                    minMatchCharLength: 2,
                    includeScore: true,
                    ignoreLocation: true,
                    useExtendedSearch: true
                });
                const fuseResults = fuse.search(search.trim());
                console.log('Fuse.js results:', fuseResults.length);
                const scoreMap = new Map();
                fuseResults.forEach((result, index) => {
                    const relevanceScore = Math.round((1 - (result.score || 0)) * 100);
                    scoreMap.set(result.item.user.id, {
                        score: relevanceScore,
                        position: index
                    });
                });
                scoredCandidates = users
                    .map(user => {
                    const scoreData = scoreMap.get(user.id);
                    return {
                        user,
                        score: scoreData?.score || 0,
                        matchDetails: []
                    };
                })
                    .filter(item => item.score > 0);
            }
            if (sortBy === 'relevance' && search && search.trim() !== '') {
                scoredCandidates.sort((a, b) => b.score - a.score);
            }
            else {
                scoredCandidates.sort((a, b) => {
                    let comparison = 0;
                    switch (sortBy) {
                        case 'name':
                            const nameA = a.user.profile?.firstName || '';
                            const nameB = b.user.profile?.firstName || '';
                            comparison = nameA.localeCompare(nameB);
                            break;
                        case 'experience':
                            const expA = a.user.profile?.yearsOfExperience || 0;
                            const expB = b.user.profile?.yearsOfExperience || 0;
                            comparison = expA - expB;
                            break;
                        case 'lastActive':
                        default:
                            const dateA = new Date(a.user.updatedAt).getTime();
                            const dateB = new Date(b.user.updatedAt).getTime();
                            comparison = dateA - dateB;
                            break;
                    }
                    return sortOrder === 'desc' ? -comparison : comparison;
                });
            }
            const total = scoredCandidates.length;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const paginatedResults = scoredCandidates.slice(offset, offset + parseInt(limit));
            const candidates = paginatedResults.map(item => {
                const candidate = this.transformUserToCandidate(item.user);
                return {
                    ...candidate,
                    matchScore: item.score || candidate.matchScore
                };
            });
            const result = {
                data: candidates,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            };
            console.log('=== ADVANCED SEARCH CANDIDATES END ===');
            console.log('Results:', {
                totalFound: total,
                page: result.page,
                returned: candidates.length
            });
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
                relations: ['candidate', 'candidate.profile', 'candidate.skills', 'candidate.skills.skill']
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
                    'skills.skill',
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
        const skills = user.skills?.map(userSkill => userSkill.skill?.name).filter(Boolean) || [];
        const latestExperience = user.experiences?.[0];
        const latestEducation = user.educations?.[0];
        const mainCV = user.documents?.find(doc => doc.type === 'cv' && doc.isMain);
        const cvUrl = mainCV?.url || mainCV?.path || null;
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
            cvUrl: cvUrl,
            phone: user.phone || null,
            email: profile?.email || null,
        };
        if (detailed) {
            return {
                ...baseData,
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