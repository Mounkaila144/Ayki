"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const documents_controller_1 = require("./documents.controller");
const documents_service_1 = require("./documents.service");
const document_entity_1 = require("../../entities/document.entity");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let DocumentsModule = class DocumentsModule {
};
exports.DocumentsModule = DocumentsModule;
exports.DocumentsModule = DocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([document_entity_1.Document, user_entity_1.User, user_profile_entity_1.UserProfile]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const ext = (0, path_1.extname)(file.originalname);
                        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                        return callback(new Error('Only image files are allowed!'), false);
                    }
                    callback(null, true);
                },
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [documents_controller_1.DocumentsController],
        providers: [documents_service_1.DocumentsService],
        exports: [documents_service_1.DocumentsService],
    })
], DocumentsModule);
//# sourceMappingURL=documents.module.js.map