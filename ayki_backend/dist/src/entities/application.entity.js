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
exports.Application = exports.ApplicationSource = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const job_offer_entity_1 = require("./job-offer.entity");
const interview_entity_1 = require("./interview.entity");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["REVIEWED"] = "reviewed";
    ApplicationStatus["SHORTLISTED"] = "shortlisted";
    ApplicationStatus["INTERVIEW_SCHEDULED"] = "interview_scheduled";
    ApplicationStatus["INTERVIEWED"] = "interviewed";
    ApplicationStatus["SECOND_INTERVIEW"] = "second_interview";
    ApplicationStatus["FINAL_INTERVIEW"] = "final_interview";
    ApplicationStatus["REFERENCE_CHECK"] = "reference_check";
    ApplicationStatus["OFFER_MADE"] = "offer_made";
    ApplicationStatus["OFFER_ACCEPTED"] = "offer_accepted";
    ApplicationStatus["OFFER_DECLINED"] = "offer_declined";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["WITHDRAWN"] = "withdrawn";
    ApplicationStatus["HIRED"] = "hired";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ApplicationSource;
(function (ApplicationSource) {
    ApplicationSource["DIRECT"] = "direct";
    ApplicationSource["REFERRAL"] = "referral";
    ApplicationSource["LINKEDIN"] = "linkedin";
    ApplicationSource["INDEED"] = "indeed";
    ApplicationSource["GLASSDOOR"] = "glassdoor";
    ApplicationSource["COMPANY_WEBSITE"] = "company_website";
    ApplicationSource["JOB_BOARD"] = "job_board";
    ApplicationSource["RECRUITER"] = "recruiter";
    ApplicationSource["OTHER"] = "other";
})(ApplicationSource || (exports.ApplicationSource = ApplicationSource = {}));
let Application = class Application {
    id;
    status;
    source;
    coverLetter;
    message;
    notes;
    recruiterNotes;
    matchScore;
    recruiterRating;
    recruiterFeedback;
    attachments;
    customFields;
    reviewedAt;
    respondedAt;
    rejectedAt;
    withdrawnAt;
    isStarred;
    isArchived;
    viewCount;
    createdAt;
    updatedAt;
    candidate;
    candidateId;
    recruiter;
    recruiterId;
    jobOffer;
    jobOfferId;
    interviews;
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationSource,
        default: ApplicationSource.DIRECT,
    }),
    __metadata("design:type", String)
], Application.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "coverLetter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "recruiterNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Application.prototype, "matchScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Application.prototype, "recruiterRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "recruiterFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Application.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Application.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Application.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Application.prototype, "respondedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Application.prototype, "rejectedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Application.prototype, "withdrawnAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Application.prototype, "isStarred", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Application.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Application.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Application.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Application.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.applications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Application.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Application.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.receivedApplications),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Application.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Application.prototype, "recruiterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, (jobOffer) => jobOffer.applications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], Application.prototype, "jobOffer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Application.prototype, "jobOfferId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_entity_1.Interview, (interview) => interview.application),
    __metadata("design:type", Array)
], Application.prototype, "interviews", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)('applications')
], Application);
//# sourceMappingURL=application.entity.js.map