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
exports.SignUpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../entities/user.entity");
class SignUpDto {
    phone;
    password;
    userType;
    firstName;
    lastName;
    company;
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du Niger',
        example: '90123456',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le numéro de téléphone est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[9876]\d{7}$/, {
        message: 'Le numéro de téléphone doit être un numéro du Niger valide (8 chiffres commençant par 9, 8, 7, ou 6)',
    }),
    __metadata("design:type", String)
], SignUpDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mot de passe',
        example: 'motdepasse123',
        minLength: 8,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le mot de passe est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type d\'utilisateur',
        enum: user_entity_1.UserType,
        example: user_entity_1.UserType.CANDIDATE,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le type d\'utilisateur est requis' }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserType, { message: 'Le type d\'utilisateur doit être "candidate" ou "recruiter"' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prénom',
        example: 'Jean',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de famille',
        example: 'Dupont',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de famille est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Le nom de famille ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nom de l\'entreprise (requis pour les recruteurs)',
        example: 'TechCorp',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "company", void 0);
//# sourceMappingURL=signup.dto.js.map