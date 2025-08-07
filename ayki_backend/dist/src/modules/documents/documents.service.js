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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("../../entities/document.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
let DocumentsService = class DocumentsService {
    documentRepository;
    profileRepository;
    constructor(documentRepository, profileRepository) {
        this.documentRepository = documentRepository;
        this.profileRepository = profileRepository;
    }
    async uploadDocument(file, body, userId) {
        try {
            console.log('=== UPLOAD SERVICE START ===');
            console.log('Upload request received:', {
                filename: file?.filename,
                originalname: file?.originalname,
                path: file?.path,
                mimetype: file?.mimetype,
                size: file?.size,
                type: body?.type,
                userId
            });
            if (!file) {
                throw new Error('No file provided to service');
            }
            console.log('Creating document entity...');
            const document = this.documentRepository.create({
                name: file.originalname,
                originalName: file.originalname,
                type: body.type || 'cv',
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                userId,
                ...body
            });
            console.log('Saving document to database...');
            const savedDocument = await this.documentRepository.save(document);
            console.log('Document saved successfully:', typeof savedDocument);
            if (body.type === 'avatar' && userId) {
                try {
                    const avatarPath = `/uploads/${file.filename}`;
                    console.log('Updating profile with avatar:', avatarPath);
                    let profile = await this.profileRepository.findOne({ where: { userId } });
                    if (!profile) {
                        console.log('Creating new profile for user:', userId);
                        profile = this.profileRepository.create({
                            userId,
                            firstName: '',
                            lastName: '',
                            avatar: avatarPath,
                        });
                    }
                    else {
                        console.log('Updating existing profile');
                        profile.avatar = avatarPath;
                    }
                    const savedProfile = await this.profileRepository.save(profile);
                    console.log('Profile updated with avatar:', savedProfile.avatar);
                }
                catch (profileError) {
                    console.error('Error updating profile:', profileError);
                }
            }
            console.log('Preparing response...');
            const response = {
                ...savedDocument,
                url: `/uploads/${file.filename}`
            };
            console.log('=== UPLOAD SERVICE SUCCESS ===');
            return response;
        }
        catch (error) {
            console.error('=== UPLOAD SERVICE ERROR ===');
            console.error('Service error:', error);
            console.error('Stack trace:', error.stack);
            throw error;
        }
    }
    create(createDocumentDto) {
        const document = this.documentRepository.create(createDocumentDto);
        return this.documentRepository.save(document);
    }
    findAll() {
        return this.documentRepository.find({
            relations: ['user']
        });
    }
    findOne(id) {
        return this.documentRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }
    update(id, updateDocumentDto) {
        return this.documentRepository.update(id, updateDocumentDto);
    }
    remove(id) {
        return this.documentRepository.delete(id);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map