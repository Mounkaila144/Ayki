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
exports.Analytics = exports.DeviceType = exports.AnalyticsType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var AnalyticsType;
(function (AnalyticsType) {
    AnalyticsType["PROFILE_VIEW"] = "profile_view";
    AnalyticsType["JOB_VIEW"] = "job_view";
    AnalyticsType["APPLICATION_SUBMITTED"] = "application_submitted";
    AnalyticsType["SEARCH_PERFORMED"] = "search_performed";
    AnalyticsType["DOCUMENT_DOWNLOADED"] = "document_downloaded";
    AnalyticsType["BOOKMARK_ADDED"] = "bookmark_added";
    AnalyticsType["MESSAGE_SENT"] = "message_sent";
    AnalyticsType["LOGIN"] = "login";
    AnalyticsType["LOGOUT"] = "logout";
    AnalyticsType["REGISTRATION"] = "registration";
    AnalyticsType["PASSWORD_RESET"] = "password_reset";
    AnalyticsType["PROFILE_UPDATED"] = "profile_updated";
    AnalyticsType["SKILL_ADDED"] = "skill_added";
    AnalyticsType["EXPERIENCE_ADDED"] = "experience_added";
    AnalyticsType["EDUCATION_ADDED"] = "education_added";
    AnalyticsType["OTHER"] = "other";
})(AnalyticsType || (exports.AnalyticsType = AnalyticsType = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType["DESKTOP"] = "desktop";
    DeviceType["MOBILE"] = "mobile";
    DeviceType["TABLET"] = "tablet";
    DeviceType["OTHER"] = "other";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
let Analytics = class Analytics {
    id;
    type;
    action;
    category;
    label;
    value;
    properties;
    url;
    referrer;
    userAgent;
    ipAddress;
    country;
    city;
    deviceType;
    browser;
    os;
    sessionId;
    timestamp;
    duration;
    createdAt;
    updatedAt;
    user;
    userId;
};
exports.Analytics = Analytics;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Analytics.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AnalyticsType,
    }),
    __metadata("design:type", String)
], Analytics.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Analytics.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Analytics.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 45, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeviceType,
        nullable: true,
    }),
    __metadata("design:type", String)
], Analytics.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "browser", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "os", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Analytics.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Analytics.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Analytics.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Analytics.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Analytics.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "userId", void 0);
exports.Analytics = Analytics = __decorate([
    (0, typeorm_1.Entity)('analytics')
], Analytics);
//# sourceMappingURL=analytics.entity.js.map