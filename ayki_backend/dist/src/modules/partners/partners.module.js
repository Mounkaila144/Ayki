"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const partners_controller_1 = require("./partners.controller");
const partners_service_1 = require("./partners.service");
const partner_entity_1 = require("../../entities/partner.entity");
const user_entity_1 = require("../../entities/user.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let PartnersModule = class PartnersModule {
};
exports.PartnersModule = PartnersModule;
exports.PartnersModule = PartnersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([partner_entity_1.Partner, user_entity_1.User]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const ext = (0, path_1.extname)(file.originalname);
                        const filename = `partner-${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg\+xml|webp)$/)) {
                        return callback(new Error('Seuls les fichiers image sont autorisés!'), false);
                    }
                    callback(null, true);
                },
                limits: {
                    fileSize: 2 * 1024 * 1024,
                },
            }),
        ],
        controllers: [partners_controller_1.PartnersController],
        providers: [partners_service_1.PartnersService],
        exports: [partners_service_1.PartnersService],
    })
], PartnersModule);
//# sourceMappingURL=partners.module.js.map