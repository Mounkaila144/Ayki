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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(query) {
        return this.usersService.findAll(query);
    }
    async findOne(id) {
        return this.usersService.findOne(id);
    }
    async getUserExperiences(req) {
        return this.usersService.getUserExperiences(req.user.id);
    }
    async addUserExperience(req, experienceData) {
        return this.usersService.addUserExperience(req.user.id, experienceData);
    }
    async updateUserExperience(req, experienceId, experienceData) {
        return this.usersService.updateUserExperience(req.user.id, experienceId, experienceData);
    }
    async deleteUserExperience(req, experienceId) {
        return this.usersService.deleteUserExperience(req.user.id, experienceId);
    }
    async getUserEducation(req) {
        return this.usersService.getUserEducation(req.user.id);
    }
    async addUserEducation(req, educationData) {
        return this.usersService.addUserEducation(req.user.id, educationData);
    }
    async updateUserEducation(req, educationId, educationData) {
        return this.usersService.updateUserEducation(req.user.id, educationId, educationData);
    }
    async deleteUserEducation(req, educationId) {
        return this.usersService.deleteUserEducation(req.user.id, educationId);
    }
    async getUserSkills(req) {
        return this.usersService.getUserSkills(req.user.id);
    }
    async getAllSkills() {
        return this.usersService.getAllSkills();
    }
    async addUserSkill(req, skillData) {
        return this.usersService.addUserSkill(req.user.id, skillData);
    }
    async updateUserSkill(req, userSkillId, skillData) {
        return this.usersService.updateUserSkill(req.user.id, userSkillId, skillData);
    }
    async deleteUserSkill(req, userSkillId) {
        return this.usersService.deleteUserSkill(req.user.id, userSkillId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les utilisateurs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un utilisateur par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('me/experiences'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les expériences de l\'utilisateur connecté' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserExperiences", null);
__decorate([
    (0, common_1.Post)('me/experiences'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une expérience' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUserExperience", null);
__decorate([
    (0, common_1.Put)('me/experiences/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une expérience' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserExperience", null);
__decorate([
    (0, common_1.Delete)('me/experiences/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une expérience' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUserExperience", null);
__decorate([
    (0, common_1.Get)('me/education'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les formations de l\'utilisateur connecté' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserEducation", null);
__decorate([
    (0, common_1.Post)('me/education'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une formation' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUserEducation", null);
__decorate([
    (0, common_1.Put)('me/education/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une formation' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserEducation", null);
__decorate([
    (0, common_1.Delete)('me/education/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une formation' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUserEducation", null);
__decorate([
    (0, common_1.Get)('me/skills'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les compétences de l\'utilisateur connecté' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserSkills", null);
__decorate([
    (0, common_1.Get)('skills'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les compétences disponibles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllSkills", null);
__decorate([
    (0, common_1.Post)('me/skills'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une compétence' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUserSkill", null);
__decorate([
    (0, common_1.Put)('me/skills/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une compétence' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserSkill", null);
__decorate([
    (0, common_1.Delete)('me/skills/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une compétence' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUserSkill", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map