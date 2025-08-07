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
exports.UserSkill = exports.EndorsementStatus = exports.SkillLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const skill_entity_1 = require("./skill.entity");
var SkillLevel;
(function (SkillLevel) {
    SkillLevel["BEGINNER"] = "beginner";
    SkillLevel["INTERMEDIATE"] = "intermediate";
    SkillLevel["ADVANCED"] = "advanced";
    SkillLevel["EXPERT"] = "expert";
})(SkillLevel || (exports.SkillLevel = SkillLevel = {}));
var EndorsementStatus;
(function (EndorsementStatus) {
    EndorsementStatus["SELF_ASSESSED"] = "self_assessed";
    EndorsementStatus["PEER_ENDORSED"] = "peer_endorsed";
    EndorsementStatus["MANAGER_ENDORSED"] = "manager_endorsed";
    EndorsementStatus["CERTIFIED"] = "certified";
    EndorsementStatus["TESTED"] = "tested";
})(EndorsementStatus || (exports.EndorsementStatus = EndorsementStatus = {}));
let UserSkill = class UserSkill {
    id;
    level;
    yearsOfExperience;
    monthsOfExperience;
    endorsementStatus;
    endorsementCount;
    description;
    projects;
    certifications;
    lastUsedDate;
    isVisible;
    isFeatured;
    sortOrder;
    createdAt;
    updatedAt;
    user;
    userId;
    skill;
    skillId;
};
exports.UserSkill = UserSkill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserSkill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SkillLevel,
        default: SkillLevel.BEGINNER,
    }),
    __metadata("design:type", String)
], UserSkill.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSkill.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSkill.prototype, "monthsOfExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EndorsementStatus,
        default: EndorsementStatus.SELF_ASSESSED,
    }),
    __metadata("design:type", String)
], UserSkill.prototype, "endorsementStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSkill.prototype, "endorsementCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserSkill.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], UserSkill.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], UserSkill.prototype, "certifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], UserSkill.prototype, "lastUsedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserSkill.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserSkill.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserSkill.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserSkill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserSkill.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.skills, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], UserSkill.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSkill.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.Skill, (skill) => skill.userSkills, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", skill_entity_1.Skill)
], UserSkill.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSkill.prototype, "skillId", void 0);
exports.UserSkill = UserSkill = __decorate([
    (0, typeorm_1.Entity)('user_skills')
], UserSkill);
//# sourceMappingURL=user-skill.entity.js.map