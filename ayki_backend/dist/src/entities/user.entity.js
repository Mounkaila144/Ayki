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
exports.User = exports.AdminRole = exports.UserStatus = exports.UserType = void 0;
const typeorm_1 = require("typeorm");
const user_profile_entity_1 = require("./user-profile.entity");
const company_entity_1 = require("./company.entity");
const experience_entity_1 = require("./experience.entity");
const education_entity_1 = require("./education.entity");
const skill_entity_1 = require("./skill.entity");
const job_offer_entity_1 = require("./job-offer.entity");
const application_entity_1 = require("./application.entity");
const bookmark_entity_1 = require("./bookmark.entity");
const interview_entity_1 = require("./interview.entity");
const document_entity_1 = require("./document.entity");
const notification_entity_1 = require("./notification.entity");
var UserType;
(function (UserType) {
    UserType["CANDIDATE"] = "candidate";
    UserType["RECRUITER"] = "recruiter";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "super_admin";
    AdminRole["ADMIN"] = "admin";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
let User = class User {
    id;
    phone;
    password;
    userType;
    status;
    adminRole;
    lastLoginAt;
    emailVerifiedAt;
    phoneVerifiedAt;
    createdAt;
    updatedAt;
    profile;
    company;
    experiences;
    educations;
    skills;
    jobOffers;
    applications;
    receivedApplications;
    bookmarks;
    bookmarkedBy;
    candidateInterviews;
    recruiterInterviews;
    documents;
    notifications;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 15 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserType,
    }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AdminRole,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "adminRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "phoneVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_profile_entity_1.UserProfile, (profile) => profile.user, { cascade: true }),
    __metadata("design:type", user_profile_entity_1.UserProfile)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => company_entity_1.Company, (company) => company.user, { cascade: true }),
    __metadata("design:type", company_entity_1.Company)
], User.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => experience_entity_1.Experience, (experience) => experience.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "experiences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.Education, (education) => education.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "educations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, (skill) => skill.users),
    (0, typeorm_1.JoinTable)({
        name: 'user_skills',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_offer_entity_1.JobOffer, (jobOffer) => jobOffer.recruiter),
    __metadata("design:type", Array)
], User.prototype, "jobOffers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.candidate),
    __metadata("design:type", Array)
], User.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.recruiter),
    __metadata("design:type", Array)
], User.prototype, "receivedApplications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bookmark) => bookmark.recruiter),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bookmark) => bookmark.candidate),
    __metadata("design:type", Array)
], User.prototype, "bookmarkedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_entity_1.Interview, (interview) => interview.candidate),
    __metadata("design:type", Array)
], User.prototype, "candidateInterviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_entity_1.Interview, (interview) => interview.recruiter),
    __metadata("design:type", Array)
], User.prototype, "recruiterInterviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (document) => document.user),
    __metadata("design:type", Array)
], User.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map