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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const signup_dto_1 = require("./dto/signup.dto");
const signin_dto_1 = require("./dto/signin.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(signUpDto) {
        return this.authService.signUp(signUpDto);
    }
    async signIn(signInDto) {
        return this.authService.signIn(signInDto);
    }
    async getProfile(req) {
        return req.user;
    }
    async refreshToken(req) {
        return this.authService.refreshToken(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: 'Inscription d\'un nouvel utilisateur' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Utilisateur créé avec succès',
        schema: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        phone: { type: 'string' },
                        userType: { type: 'string' },
                        status: { type: 'string' },
                        profile: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                            },
                        },
                    },
                },
                token: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Utilisateur déjà existant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Connexion d\'un utilisateur' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connexion réussie',
        schema: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        phone: { type: 'string' },
                        userType: { type: 'string' },
                        status: { type: 'string' },
                        profile: { type: 'object' },
                        company: { type: 'object' },
                    },
                },
                token: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Identifiants invalides' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le profil de l\'utilisateur connecté' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profil utilisateur récupéré avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Rafraîchir le token JWT' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token rafraîchi avec succès',
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map