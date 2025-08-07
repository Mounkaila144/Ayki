"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const companies_module_1 = require("./modules/companies/companies.module");
const skills_module_1 = require("./modules/skills/skills.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const applications_module_1 = require("./modules/applications/applications.module");
const bookmarks_module_1 = require("./modules/bookmarks/bookmarks.module");
const interviews_module_1 = require("./modules/interviews/interviews.module");
const documents_module_1 = require("./modules/documents/documents.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const admin_module_1 = require("./modules/admin/admin.module");
const recruiters_module_1 = require("./modules/recruiters/recruiters.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            companies_module_1.CompaniesModule,
            skills_module_1.SkillsModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
            bookmarks_module_1.BookmarksModule,
            interviews_module_1.InterviewsModule,
            documents_module_1.DocumentsModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            admin_module_1.AdminModule,
            recruiters_module_1.RecruitersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map