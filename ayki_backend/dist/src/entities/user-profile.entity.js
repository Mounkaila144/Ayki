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
exports.UserProfile = exports.AvailabilityStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["IMMEDIATE"] = "immediate";
    AvailabilityStatus["ONE_WEEK"] = "one_week";
    AvailabilityStatus["TWO_WEEKS"] = "two_weeks";
    AvailabilityStatus["ONE_MONTH"] = "one_month";
    AvailabilityStatus["TWO_MONTHS"] = "two_months";
    AvailabilityStatus["THREE_MONTHS"] = "three_months";
    AvailabilityStatus["NOT_AVAILABLE"] = "not_available";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
let UserProfile = class UserProfile {
    id;
    firstName;
    lastName;
    email;
    title;
    location;
    summary;
    bio;
    avatar;
    dateOfBirth;
    gender;
    nationality;
    address;
    postalCode;
    city;
    country;
    website;
    linkedin;
    github;
    portfolio;
    salaryExpectation;
    availability;
    yearsOfExperience;
    openToRemote;
    openToRelocation;
    languages;
    interests;
    profileCompletion;
    profileViews;
    rating;
    ratingCount;
    createdAt;
    updatedAt;
    user;
    userId;
};
exports.UserProfile = UserProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UserProfile.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UserProfile.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], UserProfile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "github", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "salaryExpectation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AvailabilityStatus,
        nullable: true,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserProfile.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserProfile.prototype, "openToRemote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserProfile.prototype, "openToRelocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], UserProfile.prototype, "languages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], UserProfile.prototype, "interests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserProfile.prototype, "profileCompletion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserProfile.prototype, "profileViews", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserProfile.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserProfile.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.profile),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], UserProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserProfile.prototype, "userId", void 0);
exports.UserProfile = UserProfile = __decorate([
    (0, typeorm_1.Entity)('user_profiles')
], UserProfile);
//# sourceMappingURL=user-profile.entity.js.map