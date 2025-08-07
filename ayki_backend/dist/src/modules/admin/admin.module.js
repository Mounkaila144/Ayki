"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_simple_1 = require("./admin.service.simple");
const admin_guard_1 = require("../../guards/admin.guard");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const company_entity_1 = require("../../entities/company.entity");
const job_offer_entity_1 = require("../../entities/job-offer.entity");
const application_entity_1 = require("../../entities/application.entity");
const interview_entity_1 = require("../../entities/interview.entity");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_profile_entity_1.UserProfile,
                company_entity_1.Company,
                job_offer_entity_1.JobOffer,
                application_entity_1.Application,
                interview_entity_1.Interview,
            ]),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_simple_1.SimpleAdminService, admin_guard_1.AdminGuard],
        exports: [admin_service_simple_1.SimpleAdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map