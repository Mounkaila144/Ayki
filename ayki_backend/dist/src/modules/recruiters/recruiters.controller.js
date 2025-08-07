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
exports.CandidatesController = exports.RecruitersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const recruiters_service_1 = require("./recruiters.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RecruitersController = class RecruitersController {
    recruitersService;
    constructor(recruitersService) {
        this.recruitersService = recruitersService;
    }
    async getMyStats(req) {
        return this.recruitersService.getRecruiterStats(req.user.id);
    }
};
exports.RecruitersController = RecruitersController;
__decorate([
    (0, common_1.Get)('me/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recruiter statistics' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "getMyStats", null);
exports.RecruitersController = RecruitersController = __decorate([
    (0, swagger_1.ApiTags)('recruiters'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('recruiters'),
    __metadata("design:paramtypes", [recruiters_service_1.RecruitersService])
], RecruitersController);
let CandidatesController = class CandidatesController {
    recruitersService;
    constructor(recruitersService) {
        this.recruitersService = recruitersService;
    }
    async searchCandidates(query, req) {
        return this.recruitersService.searchCandidates(req.user.id, query);
    }
    async getBookmarkedCandidates(req) {
        return this.recruitersService.getBookmarkedCandidates(req.user.id);
    }
    async toggleBookmark(candidateId, req) {
        return this.recruitersService.toggleCandidateBookmark(req.user.id, candidateId);
    }
    async getCandidateProfile(candidateId, req) {
        return this.recruitersService.getCandidateProfile(req.user.id, candidateId);
    }
};
exports.CandidatesController = CandidatesController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search candidates with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Location filter' }),
    (0, swagger_1.ApiQuery)({ name: 'skills', required: false, description: 'Skills filter (comma-separated)' }),
    (0, swagger_1.ApiQuery)({ name: 'experience', required: false, description: 'Experience level' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['match', 'name', 'experience', 'lastActive'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "searchCandidates", null);
__decorate([
    (0, common_1.Get)('bookmarked'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookmarked candidates' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getBookmarkedCandidates", null);
__decorate([
    (0, common_1.Post)(':candidateId/bookmark'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle candidate bookmark' }),
    __param(0, (0, common_1.Param)('candidateId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "toggleBookmark", null);
__decorate([
    (0, common_1.Get)(':candidateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get candidate profile' }),
    __param(0, (0, common_1.Param)('candidateId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getCandidateProfile", null);
exports.CandidatesController = CandidatesController = __decorate([
    (0, swagger_1.ApiTags)('candidates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('candidates'),
    __metadata("design:paramtypes", [recruiters_service_1.RecruitersService])
], CandidatesController);
//# sourceMappingURL=recruiters.controller.js.map