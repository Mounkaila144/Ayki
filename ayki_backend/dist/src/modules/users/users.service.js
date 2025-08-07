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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const experience_entity_1 = require("../../entities/experience.entity");
const education_entity_1 = require("../../entities/education.entity");
const user_skill_entity_1 = require("../../entities/user-skill.entity");
const skill_entity_1 = require("../../entities/skill.entity");
let UsersService = class UsersService {
    userRepository;
    experienceRepository;
    educationRepository;
    userSkillRepository;
    skillRepository;
    constructor(userRepository, experienceRepository, educationRepository, userSkillRepository, skillRepository) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.userSkillRepository = userSkillRepository;
        this.skillRepository = skillRepository;
    }
    async findAll(query) {
        return this.userRepository.find({
            relations: ['profile', 'company'],
            take: query.limit || 10,
            skip: query.offset || 0,
        });
    }
    async findOne(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['profile', 'company', 'experiences', 'educations', 'skills'],
        });
    }
    async getUserExperiences(userId) {
        return this.experienceRepository.find({
            where: { userId },
            order: { sortOrder: 'ASC', createdAt: 'DESC' },
        });
    }
    async addUserExperience(userId, experienceData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const startDate = experienceData.startDate ? new Date(experienceData.startDate + '-01') : null;
        const endDate = experienceData.endDate ? new Date(experienceData.endDate + '-01') : null;
        const experience = this.experienceRepository.create({
            ...experienceData,
            userId,
            startDate,
            endDate,
            isCurrent: experienceData.isCurrentJob || false,
        });
        return await this.experienceRepository.save(experience);
    }
    async updateUserExperience(userId, experienceId, experienceData) {
        const experience = await this.experienceRepository.findOne({
            where: { id: experienceId, userId },
        });
        if (!experience) {
            throw new common_1.NotFoundException('Expérience non trouvée');
        }
        const startDate = experienceData.startDate ? new Date(experienceData.startDate + '-01') : experience.startDate;
        const endDate = experienceData.endDate ? new Date(experienceData.endDate + '-01') : null;
        Object.assign(experience, {
            ...experienceData,
            startDate,
            endDate,
            isCurrent: experienceData.isCurrentJob || false,
        });
        return await this.experienceRepository.save(experience);
    }
    async deleteUserExperience(userId, experienceId) {
        const experience = await this.experienceRepository.findOne({
            where: { id: experienceId, userId },
        });
        if (!experience) {
            throw new common_1.NotFoundException('Expérience non trouvée');
        }
        await this.experienceRepository.remove(experience);
        return { message: 'Expérience supprimée avec succès' };
    }
    async getUserEducation(userId) {
        return this.educationRepository.find({
            where: { userId },
            order: { graduationYear: 'DESC', createdAt: 'DESC' },
        });
    }
    async addUserEducation(userId, educationData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const startDate = educationData.startDate ? new Date(educationData.startDate + '-01') : null;
        const endDate = educationData.endDate ? new Date(educationData.endDate + '-01') : null;
        const education = this.educationRepository.create({
            ...educationData,
            userId,
            startDate,
            endDate,
        });
        return await this.educationRepository.save(education);
    }
    async updateUserEducation(userId, educationId, educationData) {
        const education = await this.educationRepository.findOne({
            where: { id: educationId, userId },
        });
        if (!education) {
            throw new common_1.NotFoundException('Formation non trouvée');
        }
        const startDate = educationData.startDate ? new Date(educationData.startDate + '-01') : education.startDate;
        const endDate = educationData.endDate ? new Date(educationData.endDate + '-01') : null;
        Object.assign(education, {
            ...educationData,
            startDate,
            endDate,
        });
        return await this.educationRepository.save(education);
    }
    async deleteUserEducation(userId, educationId) {
        const education = await this.educationRepository.findOne({
            where: { id: educationId, userId },
        });
        if (!education) {
            throw new common_1.NotFoundException('Formation non trouvée');
        }
        await this.educationRepository.remove(education);
        return { message: 'Formation supprimée avec succès' };
    }
    async getUserSkills(userId) {
        return this.userSkillRepository.find({
            where: { userId },
            relations: ['skill'],
            order: { sortOrder: 'ASC', createdAt: 'DESC' },
        });
    }
    async getAllSkills() {
        return this.skillRepository.find({
            where: { isActive: true },
            order: { usageCount: 'DESC', name: 'ASC' },
        });
    }
    async addUserSkill(userId, skillData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        let skill;
        if (skillData.skillId) {
            const foundSkill = await this.skillRepository.findOne({ where: { id: skillData.skillId } });
            if (!foundSkill) {
                throw new common_1.NotFoundException('Compétence non trouvée');
            }
            skill = foundSkill;
        }
        else if (skillData.name) {
            const foundSkill = await this.skillRepository.findOne({
                where: { name: skillData.name.toLowerCase() }
            });
            if (foundSkill) {
                skill = foundSkill;
            }
            else {
                const newSkill = this.skillRepository.create({
                    name: skillData.name,
                    category: skillData.category || 'other',
                    description: skillData.description,
                });
                skill = await this.skillRepository.save(newSkill);
            }
        }
        else {
            throw new Error('Nom de compétence ou ID requis');
        }
        const existingUserSkill = await this.userSkillRepository.findOne({
            where: { userId, skillId: skill.id },
        });
        if (existingUserSkill) {
            throw new Error('Cette compétence est déjà ajoutée');
        }
        const userSkill = this.userSkillRepository.create({
            userId,
            skillId: skill.id,
            level: skillData.level || 'beginner',
            yearsOfExperience: skillData.yearsOfExperience || 0,
            monthsOfExperience: skillData.monthsOfExperience || 0,
            description: skillData.description,
            lastUsedDate: skillData.lastUsedDate ? new Date(skillData.lastUsedDate) : undefined,
        });
        const savedUserSkill = await this.userSkillRepository.save(userSkill);
        await this.skillRepository.update(skill.id, { usageCount: skill.usageCount + 1 });
        return await this.userSkillRepository.findOne({
            where: { id: savedUserSkill.id },
            relations: ['skill'],
        });
    }
    async updateUserSkill(userId, userSkillId, skillData) {
        const userSkill = await this.userSkillRepository.findOne({
            where: { id: userSkillId, userId },
            relations: ['skill'],
        });
        if (!userSkill) {
            throw new common_1.NotFoundException('Compétence non trouvée');
        }
        Object.assign(userSkill, {
            level: skillData.level || userSkill.level,
            yearsOfExperience: skillData.yearsOfExperience || userSkill.yearsOfExperience,
            monthsOfExperience: skillData.monthsOfExperience || userSkill.monthsOfExperience,
            description: skillData.description,
            lastUsedDate: skillData.lastUsedDate ? new Date(skillData.lastUsedDate) : userSkill.lastUsedDate,
        });
        return await this.userSkillRepository.save(userSkill);
    }
    async deleteUserSkill(userId, userSkillId) {
        const userSkill = await this.userSkillRepository.findOne({
            where: { id: userSkillId, userId },
            relations: ['skill'],
        });
        if (!userSkill) {
            throw new common_1.NotFoundException('Compétence non trouvée');
        }
        const skill = userSkill.skill;
        if (skill && skill.usageCount > 0) {
            await this.skillRepository.update(skill.id, { usageCount: skill.usageCount - 1 });
        }
        await this.userSkillRepository.remove(userSkill);
        return { message: 'Compétence supprimée avec succès' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(2, (0, typeorm_1.InjectRepository)(education_entity_1.Education)),
    __param(3, (0, typeorm_1.InjectRepository)(user_skill_entity_1.UserSkill)),
    __param(4, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map