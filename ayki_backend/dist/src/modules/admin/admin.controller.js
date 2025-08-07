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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_simple_1 = require("./admin.service.simple");
const admin_guard_1 = require("../../guards/admin.guard");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async getCandidates(page, limit, sortBy, sortOrder, status, search, location, startDate, endDate, emailVerified, phoneVerified) {
        const filters = {
            status,
            search,
            location,
            startDate,
            endDate,
            emailVerified,
            phoneVerified,
        };
        const pagination = {
            page: page ? parseInt(page.toString(), 10) : 1,
            limit: limit ? parseInt(limit.toString(), 10) : 10,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'DESC',
        };
        return this.adminService.getCandidates(filters, pagination);
    }
    async getRecruiters(page, limit, sortBy, sortOrder, status, search, location, company, startDate, endDate, emailVerified, phoneVerified) {
        const filters = {
            status,
            search,
            location,
            company,
            startDate,
            endDate,
            emailVerified,
            phoneVerified,
        };
        const pagination = {
            page: page ? parseInt(page.toString(), 10) : 1,
            limit: limit ? parseInt(limit.toString(), 10) : 10,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'DESC',
        };
        return this.adminService.getRecruiters(filters, pagination);
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async updateUserStatus(id, updateDto) {
        return this.adminService.updateUserStatus(id, updateDto);
    }
    async deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    async getAllJobs(query) {
        return this.adminService.getAllJobs(query);
    }
    async createAdminJob(req, createJobDto) {
        return this.adminService.createAdminJob(req.user.id, createJobDto);
    }
    async updateAdminJob(id, updateJobDto) {
        return this.adminService.updateAdminJob(id, updateJobDto);
    }
    async deleteAdminJob(id) {
        return this.adminService.deleteAdminJob(id);
    }
    async updateRecruiterJob(id, updateJobDto) {
        return this.adminService.updateRecruiterJob(id, updateJobDto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les statistiques du dashboard admin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistiques récupérées avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('candidates'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer la liste des candidats avec filtres et pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Numéro de page' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Champ de tri' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Ordre de tri' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'inactive', 'suspended', 'pending'], description: 'Statut' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Recherche' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, type: String, description: 'Localisation' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Date de début' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Date de fin' }),
    (0, swagger_1.ApiQuery)({ name: 'emailVerified', required: false, type: Boolean, description: 'Email vérifié' }),
    (0, swagger_1.ApiQuery)({ name: 'phoneVerified', required: false, type: Boolean, description: 'Téléphone vérifié' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des candidats récupérée avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('location')),
    __param(7, (0, common_1.Query)('startDate')),
    __param(8, (0, common_1.Query)('endDate')),
    __param(9, (0, common_1.Query)('emailVerified')),
    __param(10, (0, common_1.Query)('phoneVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCandidates", null);
__decorate([
    (0, common_1.Get)('recruiters'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer la liste des recruteurs avec filtres et pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Numéro de page' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Champ de tri' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Ordre de tri' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'inactive', 'suspended', 'pending'], description: 'Statut' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Recherche' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, type: String, description: 'Localisation' }),
    (0, swagger_1.ApiQuery)({ name: 'company', required: false, type: String, description: 'Entreprise' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Date de début' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Date de fin' }),
    (0, swagger_1.ApiQuery)({ name: 'emailVerified', required: false, type: Boolean, description: 'Email vérifié' }),
    (0, swagger_1.ApiQuery)({ name: 'phoneVerified', required: false, type: Boolean, description: 'Téléphone vérifié' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des recruteurs récupérée avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('location')),
    __param(7, (0, common_1.Query)('company')),
    __param(8, (0, common_1.Query)('startDate')),
    __param(9, (0, common_1.Query)('endDate')),
    __param(10, (0, common_1.Query)('emailVerified')),
    __param(11, (0, common_1.Query)('phoneVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String, String, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRecruiters", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les détails d\'un utilisateur par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Détails de l\'utilisateur récupérés avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('users/:id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut d\'un utilisateur' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statut de l\'utilisateur mis à jour avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur (soft delete)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Utilisateur supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - privilèges admin requis' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les annonces (y compris admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des annonces récupérée avec succès' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllJobs", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une annonce administrative (lecture seule)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Annonce administrative créée avec succès' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdminJob", null);
__decorate([
    (0, common_1.Put)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une annonce administrative' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annonce mise à jour avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une annonce administrative' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annonce supprimée avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdminJob", null);
__decorate([
    (0, common_1.Put)('recruiter-jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une annonce de recruteur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annonce de recruteur mise à jour avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRecruiterJob", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_simple_1.SimpleAdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map