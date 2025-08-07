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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("../../entities/skill.entity");
let SkillsService = class SkillsService {
    skillRepository;
    constructor(skillRepository) {
        this.skillRepository = skillRepository;
    }
    create(createSkillDto) {
        const skill = this.skillRepository.create(createSkillDto);
        return this.skillRepository.save(skill);
    }
    async findAll() {
        return this.skillRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findByCategory(category) {
        return this.skillRepository.find({
            where: { category: category, isActive: true },
            order: { name: 'ASC' },
        });
    }
    findOne(id) {
        return this.skillRepository.findOne({ where: { id } });
    }
    update(id, updateSkillDto) {
        return this.skillRepository.update(id, updateSkillDto);
    }
    remove(id) {
        return this.skillRepository.delete(id);
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map