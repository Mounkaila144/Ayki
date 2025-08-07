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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOfferSkill = exports.SkillImportance = void 0;
const typeorm_1 = require("typeorm");
const job_offer_entity_1 = require("./job-offer.entity");
const skill_entity_1 = require("./skill.entity");
const user_skill_entity_1 = require("./user-skill.entity");
var SkillImportance;
(function (SkillImportance) {
    SkillImportance["REQUIRED"] = "required";
    SkillImportance["PREFERRED"] = "preferred";
    SkillImportance["NICE_TO_HAVE"] = "nice_to_have";
})(SkillImportance || (exports.SkillImportance = SkillImportance = {}));
let JobOfferSkill = class JobOfferSkill {
    id;
    requiredLevel;
    importance;
    minYearsExperience;
    description;
    weight;
    sortOrder;
    createdAt;
    updatedAt;
    jobOffer;
    jobOfferId;
    skill;
    skillId;
};
exports.JobOfferSkill = JobOfferSkill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_skill_entity_1.SkillLevel,
        default: user_skill_entity_1.SkillLevel.INTERMEDIATE,
    }),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "requiredLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SkillImportance,
        default: SkillImportance.REQUIRED,
    }),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "importance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], JobOfferSkill.prototype, "minYearsExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], JobOfferSkill.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], JobOfferSkill.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobOfferSkill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobOfferSkill.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, (jobOffer) => jobOffer.requiredSkills, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], JobOfferSkill.prototype, "jobOffer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "jobOfferId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.Skill, (skill) => skill.jobOfferSkills, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", skill_entity_1.Skill)
], JobOfferSkill.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOfferSkill.prototype, "skillId", void 0);
exports.JobOfferSkill = JobOfferSkill = __decorate([
    (0, typeorm_1.Entity)('job_offer_skills')
], JobOfferSkill);
//# sourceMappingURL=job-offer-skill.entity.js.map