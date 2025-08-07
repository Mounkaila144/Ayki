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
exports.Interview = exports.InterviewStatus = exports.InterviewType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const application_entity_1 = require("./application.entity");
var InterviewType;
(function (InterviewType) {
    InterviewType["PHONE"] = "phone";
    InterviewType["VIDEO"] = "video";
    InterviewType["IN_PERSON"] = "in_person";
    InterviewType["TECHNICAL"] = "technical";
    InterviewType["BEHAVIORAL"] = "behavioral";
    InterviewType["PANEL"] = "panel";
    InterviewType["GROUP"] = "group";
    InterviewType["FINAL"] = "final";
})(InterviewType || (exports.InterviewType = InterviewType = {}));
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "scheduled";
    InterviewStatus["CONFIRMED"] = "confirmed";
    InterviewStatus["IN_PROGRESS"] = "in_progress";
    InterviewStatus["COMPLETED"] = "completed";
    InterviewStatus["CANCELLED"] = "cancelled";
    InterviewStatus["RESCHEDULED"] = "rescheduled";
    InterviewStatus["NO_SHOW"] = "no_show";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
let Interview = class Interview {
    id;
    title;
    description;
    type;
    status;
    scheduledAt;
    duration;
    location;
    meetingLink;
    meetingId;
    meetingPassword;
    interviewers;
    agenda;
    preparation;
    notes;
    feedback;
    rating;
    evaluation;
    attachments;
    startedAt;
    endedAt;
    confirmedAt;
    cancelledAt;
    cancellationReason;
    isRecorded;
    reminderSent;
    createdAt;
    updatedAt;
    candidate;
    candidateId;
    recruiter;
    recruiterId;
    application;
    applicationId;
};
exports.Interview = Interview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Interview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Interview.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InterviewType,
        default: InterviewType.VIDEO,
    }),
    __metadata("design:type", String)
], Interview.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InterviewStatus,
        default: InterviewStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Interview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Interview.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 60 }),
    __metadata("design:type", Number)
], Interview.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "meetingLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "meetingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "meetingPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Interview.prototype, "interviewers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "agenda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "preparation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Interview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Interview.prototype, "evaluation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Interview.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Interview.prototype, "isRecorded", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Interview.prototype, "reminderSent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Interview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Interview.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.candidateInterviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Interview.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.recruiterInterviews),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Interview.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "recruiterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (application) => application.interviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", application_entity_1.Application)
], Interview.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "applicationId", void 0);
exports.Interview = Interview = __decorate([
    (0, typeorm_1.Entity)('interviews')
], Interview);
//# sourceMappingURL=interview.entity.js.map