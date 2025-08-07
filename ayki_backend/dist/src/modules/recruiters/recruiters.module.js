"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recruiters_controller_1 = require("./recruiters.controller");
const recruiters_service_1 = require("./recruiters.service");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const user_skill_entity_1 = require("../../entities/user-skill.entity");
const skill_entity_1 = require("../../entities/skill.entity");
const experience_entity_1 = require("../../entities/experience.entity");
const education_entity_1 = require("../../entities/education.entity");
const application_entity_1 = require("../../entities/application.entity");
const bookmark_entity_1 = require("../../entities/bookmark.entity");
let RecruitersModule = class RecruitersModule {
};
exports.RecruitersModule = RecruitersModule;
exports.RecruitersModule = RecruitersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_profile_entity_1.UserProfile,
                user_skill_entity_1.UserSkill,
                skill_entity_1.Skill,
                experience_entity_1.Experience,
                education_entity_1.Education,
                application_entity_1.Application,
                bookmark_entity_1.Bookmark,
            ]),
        ],
        controllers: [recruiters_controller_1.RecruitersController, recruiters_controller_1.CandidatesController],
        providers: [recruiters_service_1.RecruitersService],
        exports: [recruiters_service_1.RecruitersService],
    })
], RecruitersModule);
//# sourceMappingURL=recruiters.module.js.map