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
exports.AdminUserFilterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../entities/user.entity");
class AdminUserFilterDto {
    userType;
    status;
    search;
    location;
    startDate;
    endDate;
    company;
    emailVerified;
    phoneVerified;
}
exports.AdminUserFilterDto = AdminUserFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par type d\'utilisateur',
        enum: user_entity_1.UserType
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_entity_1.UserType),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par statut',
        enum: user_entity_1.UserStatus
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_entity_1.UserStatus),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recherche par nom, prénom ou téléphone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrer par localisation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de début pour filtrer par date d\'inscription' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de fin pour filtrer par date d\'inscription' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrer par entreprise (pour les recruteurs)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminUserFilterDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrer par vérification email' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminUserFilterDto.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrer par vérification téléphone' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminUserFilterDto.prototype, "phoneVerified", void 0);
//# sourceMappingURL=admin-user-filter.dto.js.map