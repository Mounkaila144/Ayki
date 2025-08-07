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
exports.AdminDashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminDashboardStatsDto {
    totalCandidates;
    totalRecruiters;
    activeUsers;
    inactiveUsers;
    newUsersThisMonth;
    recentLogins;
    totalJobOffers;
    totalApplications;
    applicationsThisMonth;
    scheduledInterviews;
    candidateProfileCompletion;
    recruiterProfileCompletion;
}
exports.AdminDashboardStatsDto = AdminDashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre total de candidats' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "totalCandidates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre total de recruteurs' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "totalRecruiters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre d\'utilisateurs actifs' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "activeUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre d\'utilisateurs inactifs' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "inactiveUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nouvelles inscriptions ce mois' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "newUsersThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connexions récentes (7 derniers jours)' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "recentLogins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre total d\'offres d\'emploi' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "totalJobOffers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre total de candidatures' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "totalApplications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Candidatures ce mois' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "applicationsThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entretiens programmés' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "scheduledInterviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taux de complétion des profils candidats (%)' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "candidateProfileCompletion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taux de complétion des profils recruteurs (%)' }),
    __metadata("design:type", Number)
], AdminDashboardStatsDto.prototype, "recruiterProfileCompletion", void 0);
//# sourceMappingURL=admin-dashboard-stats.dto.js.map