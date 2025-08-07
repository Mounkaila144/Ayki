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
exports.JobOffer = exports.RemotePolicy = exports.ExperienceLevel = exports.JobStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const company_entity_1 = require("./company.entity");
const application_entity_1 = require("./application.entity");
const job_offer_skill_entity_1 = require("./job-offer-skill.entity");
const experience_entity_1 = require("./experience.entity");
var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "draft";
    JobStatus["PUBLISHED"] = "published";
    JobStatus["PAUSED"] = "paused";
    JobStatus["CLOSED"] = "closed";
    JobStatus["EXPIRED"] = "expired";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["ENTRY"] = "entry";
    ExperienceLevel["JUNIOR"] = "junior";
    ExperienceLevel["MID"] = "mid";
    ExperienceLevel["SENIOR"] = "senior";
    ExperienceLevel["LEAD"] = "lead";
    ExperienceLevel["EXECUTIVE"] = "executive";
})(ExperienceLevel || (exports.ExperienceLevel = ExperienceLevel = {}));
var RemotePolicy;
(function (RemotePolicy) {
    RemotePolicy["ON_SITE"] = "on_site";
    RemotePolicy["REMOTE"] = "remote";
    RemotePolicy["HYBRID"] = "hybrid";
    RemotePolicy["FLEXIBLE"] = "flexible";
})(RemotePolicy || (exports.RemotePolicy = RemotePolicy = {}));
let JobOffer = class JobOffer {
    id;
    title;
    description;
    requirements;
    responsibilities;
    benefits;
    location;
    employmentType;
    experienceLevel;
    remotePolicy;
    salaryMin;
    salaryMax;
    currency;
    salaryPeriod;
    salaryNegotiable;
    positions;
    applicationDeadline;
    startDate;
    status;
    languages;
    benefits_list;
    tags;
    viewCount;
    applicationCount;
    isActive;
    isFeatured;
    isUrgent;
    isAdminPost;
    createdAt;
    updatedAt;
    recruiter;
    recruiterId;
    company;
    companyId;
    applications;
    requiredSkills;
};
exports.JobOffer = JobOffer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobOffer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], JobOffer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], JobOffer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "responsibilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: experience_entity_1.EmploymentType,
        default: experience_entity_1.EmploymentType.FULL_TIME,
    }),
    __metadata("design:type", String)
], JobOffer.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExperienceLevel,
        default: ExperienceLevel.MID,
    }),
    __metadata("design:type", String)
], JobOffer.prototype, "experienceLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RemotePolicy,
        default: RemotePolicy.ON_SITE,
    }),
    __metadata("design:type", String)
], JobOffer.prototype, "remotePolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "salaryMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "salaryMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "salaryPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "salaryNegotiable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], JobOffer.prototype, "positions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], JobOffer.prototype, "applicationDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], JobOffer.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.DRAFT,
    }),
    __metadata("design:type", String)
], JobOffer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], JobOffer.prototype, "languages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], JobOffer.prototype, "benefits_list", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], JobOffer.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], JobOffer.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], JobOffer.prototype, "applicationCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "isUrgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "isAdminPost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobOffer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobOffer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.jobOffers, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], JobOffer.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "recruiterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, (company) => company.jobOffers, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", company_entity_1.Company)
], JobOffer.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.jobOffer),
    __metadata("design:type", Array)
], JobOffer.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_offer_skill_entity_1.JobOfferSkill, (jobOfferSkill) => jobOfferSkill.jobOffer),
    __metadata("design:type", Array)
], JobOffer.prototype, "requiredSkills", void 0);
exports.JobOffer = JobOffer = __decorate([
    (0, typeorm_1.Entity)('job_offers')
], JobOffer);
//# sourceMappingURL=job-offer.entity.js.map