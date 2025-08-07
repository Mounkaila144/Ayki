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
exports.AdminUpdateUserStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../entities/user.entity");
class AdminUpdateUserStatusDto {
    status;
}
exports.AdminUpdateUserStatusDto = AdminUpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nouveau statut de l\'utilisateur',
        enum: user_entity_1.UserStatus
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le statut est requis' }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserStatus, { message: 'Le statut doit être valide' }),
    __metadata("design:type", String)
], AdminUpdateUserStatusDto.prototype, "status", void 0);
//# sourceMappingURL=admin-update-user-status.dto.js.map