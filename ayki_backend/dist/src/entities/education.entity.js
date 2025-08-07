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
exports.Education = exports.EducationStatus = exports.DegreeLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var DegreeLevel;
(function (DegreeLevel) {
    DegreeLevel["HIGH_SCHOOL"] = "high_school";
    DegreeLevel["ASSOCIATE"] = "associate";
    DegreeLevel["BACHELOR"] = "bachelor";
    DegreeLevel["MASTER"] = "master";
    DegreeLevel["PHD"] = "phd";
    DegreeLevel["CERTIFICATE"] = "certificate";
    DegreeLevel["DIPLOMA"] = "diploma";
    DegreeLevel["PROFESSIONAL"] = "professional";
})(DegreeLevel || (exports.DegreeLevel = DegreeLevel = {}));
var EducationStatus;
(function (EducationStatus) {
    EducationStatus["COMPLETED"] = "completed";
    EducationStatus["IN_PROGRESS"] = "in_progress";
    EducationStatus["DROPPED_OUT"] = "dropped_out";
})(EducationStatus || (exports.EducationStatus = EducationStatus = {}));
let Education = class Education {
    id;
    degree;
    school;
    fieldOfStudy;
    level;
    status;
    startDate;
    endDate;
    graduationYear;
    grade;
    gpa;
    maxGpa;
    location;
    description;
    activities;
    honors;
    coursework;
    projects;
    isOnline;
    sortOrder;
    createdAt;
    updatedAt;
    user;
    userId;
};
exports.Education = Education;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Education.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Education.prototype, "degree", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Education.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "fieldOfStudy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DegreeLevel,
    }),
    __metadata("design:type", String)
], Education.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EducationStatus,
        default: EducationStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], Education.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Education.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Education.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Education.prototype, "graduationYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Education.prototype, "gpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Education.prototype, "maxGpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Education.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Education.prototype, "honors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Education.prototype, "coursework", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Education.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Education.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Education.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Education.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Education.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.educations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Education.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Education.prototype, "userId", void 0);
exports.Education = Education = __decorate([
    (0, typeorm_1.Entity)('educations')
], Education);
//# sourceMappingURL=education.entity.js.map