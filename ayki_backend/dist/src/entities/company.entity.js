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
exports.Company = exports.CompanyType = exports.CompanySize = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const job_offer_entity_1 = require("./job-offer.entity");
var CompanySize;
(function (CompanySize) {
    CompanySize["STARTUP"] = "1-10";
    CompanySize["SMALL"] = "11-50";
    CompanySize["MEDIUM"] = "51-200";
    CompanySize["LARGE"] = "201-1000";
    CompanySize["ENTERPRISE"] = "1000+";
})(CompanySize || (exports.CompanySize = CompanySize = {}));
var CompanyType;
(function (CompanyType) {
    CompanyType["STARTUP"] = "startup";
    CompanyType["PRIVATE"] = "private";
    CompanyType["PUBLIC"] = "public";
    CompanyType["NON_PROFIT"] = "non_profit";
    CompanyType["GOVERNMENT"] = "government";
})(CompanyType || (exports.CompanyType = CompanyType = {}));
let Company = class Company {
    id;
    name;
    description;
    industry;
    size;
    type;
    foundedYear;
    website;
    email;
    phone;
    address;
    city;
    postalCode;
    country;
    logo;
    banner;
    linkedin;
    twitter;
    facebook;
    benefits;
    values;
    technologies;
    isActive;
    isVerified;
    rating;
    ratingCount;
    createdAt;
    updatedAt;
    user;
    userId;
    jobOffers;
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Company.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CompanySize,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CompanyType,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "foundedYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "banner", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "twitter", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "facebook", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Company.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Company.prototype, "values", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Company.prototype, "technologies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Company.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Company.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Company.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Company.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.company),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Company.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Company.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_offer_entity_1.JobOffer, (jobOffer) => jobOffer.company),
    __metadata("design:type", Array)
], Company.prototype, "jobOffers", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)('companies')
], Company);
//# sourceMappingURL=company.entity.js.map