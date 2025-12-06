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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const user_entity_1 = require("../../entities/user.entity");
let ProfilesService = class ProfilesService {
    profileRepository;
    userRepository;
    constructor(profileRepository, userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }
    async findByUserId(userId) {
        const profile = await this.profileRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profil non trouvé');
        }
        return {
            ...profile,
            phone: profile.user?.phone || null,
        };
    }
    async updateByUserId(userId, updateData) {
        let profile = await this.profileRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            profile = this.profileRepository.create({
                userId,
                ...updateData,
            });
        }
        else {
            Object.assign(profile, updateData);
        }
        return await this.profileRepository.save(profile);
    }
    async findBySlug(slug) {
        const slugParts = slug.split('-');
        if (slugParts.length < 3) {
            throw new common_1.NotFoundException('Format de slug invalide');
        }
        const userIdPart = slugParts[slugParts.length - 1];
        const users = await this.userRepository.find({
            where: { userType: 'candidate' },
            relations: [
                'profile',
                'experiences',
                'educations',
                'skills',
                'skills.skill',
            ],
        });
        const user = users.find(u => u.id.startsWith(userIdPart));
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('Profil non trouvé');
        }
        const expectedSlug = this.generateSlug(user.profile.firstName, user.profile.lastName, user.id);
        if (expectedSlug !== slug) {
            throw new common_1.NotFoundException('Profil non trouvé');
        }
        user.profile.profileViews += 1;
        await this.profileRepository.save(user.profile);
        return {
            id: user.id,
            slug: expectedSlug,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            title: user.profile.title,
            location: user.profile.location,
            email: user.profile.email,
            phone: user.phone,
            summary: user.profile.summary,
            avatar: user.profile.avatar,
            skills: (user.skills || []).map((userSkill) => ({
                id: userSkill.id,
                name: userSkill.skill?.name || 'Compétence inconnue',
                level: userSkill.level,
                yearsOfExperience: userSkill.yearsOfExperience || 0,
            })),
            experiences: (user.experiences || []).map((exp) => ({
                id: exp.id,
                title: exp.title,
                company: exp.company,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                isCurrent: exp.isCurrent || false,
                description: exp.description,
            })),
            education: (user.educations || []).map((edu) => ({
                id: edu.id,
                degree: edu.degree,
                school: edu.school,
                fieldOfStudy: edu.fieldOfStudy,
                graduationYear: edu.graduationYear,
                grade: edu.grade,
                description: edu.description,
            })),
        };
    }
    generateSlug(firstName, lastName, userId) {
        const cleanText = (text) => text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const firstSlug = cleanText(firstName);
        const lastSlug = cleanText(lastName);
        const shortId = userId.substring(0, 8);
        return `${firstSlug}-${lastSlug}-${shortId}`;
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map