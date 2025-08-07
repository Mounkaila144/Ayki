"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_entity_1 = require("../../../entities/user.entity");
let AdminGuard = class AdminGuard extends jwt_auth_guard_1.JwtAuthGuard {
    async canActivate(context) {
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.adminRole) {
            throw new common_1.ForbiddenException('Accès refusé : privilèges administrateur requis');
        }
        const validAdminRoles = [user_entity_1.AdminRole.ADMIN, user_entity_1.AdminRole.SUPER_ADMIN];
        if (!validAdminRoles.includes(user.adminRole)) {
            throw new common_1.ForbiddenException('Accès refusé : rôle administrateur invalide');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map