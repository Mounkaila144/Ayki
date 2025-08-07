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
exports.Skill = exports.SkillCategory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_skill_entity_1 = require("./user-skill.entity");
const job_offer_skill_entity_1 = require("./job-offer-skill.entity");
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["TECHNICAL"] = "technical";
    SkillCategory["SOFT"] = "soft";
    SkillCategory["LANGUAGE"] = "language";
    SkillCategory["TOOL"] = "tool";
    SkillCategory["FRAMEWORK"] = "framework";
    SkillCategory["DATABASE"] = "database";
    SkillCategory["CLOUD"] = "cloud";
    SkillCategory["METHODOLOGY"] = "methodology";
    SkillCategory["DESIGN"] = "design";
    SkillCategory["MANAGEMENT"] = "management";
    SkillCategory["MARKETING"] = "marketing";
    SkillCategory["SALES"] = "sales";
    SkillCategory["OTHER"] = "other";
})(SkillCategory || (exports.SkillCategory = SkillCategory = {}));
let Skill = class Skill {
    id;
    name;
    description;
    category;
    subcategory;
    aliases;
    relatedSkills;
    icon;
    color;
    isActive;
    isVerified;
    usageCount;
    demandScore;
    sortOrder;
    createdAt;
    updatedAt;
    users;
    userSkills;
    jobOfferSkills;
};
exports.Skill = Skill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Skill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Skill.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SkillCategory,
        default: SkillCategory.OTHER,
    }),
    __metadata("design:type", String)
], Skill.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Skill.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Skill.prototype, "aliases", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Skill.prototype, "relatedSkills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Skill.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 7, nullable: true }),
    __metadata("design:type", String)
], Skill.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Skill.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Skill.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Skill.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Skill.prototype, "demandScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Skill.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Skill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Skill.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.skills),
    __metadata("design:type", Array)
], Skill.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_skill_entity_1.UserSkill, (userSkill) => userSkill.skill),
    __metadata("design:type", Array)
], Skill.prototype, "userSkills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_offer_skill_entity_1.JobOfferSkill, (jobOfferSkill) => jobOfferSkill.skill),
    __metadata("design:type", Array)
], Skill.prototype, "jobOfferSkills", void 0);
exports.Skill = Skill = __decorate([
    (0, typeorm_1.Entity)('skills')
], Skill);
//# sourceMappingURL=skill.entity.js.map