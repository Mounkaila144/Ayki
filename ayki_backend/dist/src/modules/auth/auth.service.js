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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../../entities/user.entity");
const user_profile_entity_1 = require("../../entities/user-profile.entity");
const company_entity_1 = require("../../entities/company.entity");
let AuthService = class AuthService {
    userRepository;
    profileRepository;
    companyRepository;
    jwtService;
    constructor(userRepository, profileRepository, companyRepository, jwtService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.companyRepository = companyRepository;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        const { phone, password, userType, firstName, lastName, company } = signUpDto;
        const existingUser = await this.userRepository.findOne({ where: { phone } });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({
            phone,
            password: hashedPassword,
            userType,
            status: user_entity_1.UserStatus.ACTIVE,
        });
        const savedUser = await this.userRepository.save(user);
        const profile = this.profileRepository.create({
            firstName,
            lastName,
            userId: savedUser.id,
            profileCompletion: this.calculateInitialCompletion(firstName, lastName),
        });
        await this.profileRepository.save(profile);
        if (userType === user_entity_1.UserType.RECRUITER && company) {
            const companyEntity = this.companyRepository.create({
                name: company,
                userId: savedUser.id,
            });
            await this.companyRepository.save(companyEntity);
        }
        const payload = { sub: savedUser.id, phone: savedUser.phone, userType: savedUser.userType };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: savedUser.id,
                phone: savedUser.phone,
                userType: savedUser.userType,
                status: savedUser.status,
                profile: {
                    firstName,
                    lastName,
                },
            },
            token,
        };
    }
    async signIn(signInDto) {
        const { phone, password } = signInDto;
        const user = await this.userRepository.findOne({
            where: { phone },
            relations: ['profile', 'company'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Numéro de téléphone ou mot de passe incorrect');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Numéro de téléphone ou mot de passe incorrect');
        }
        if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.UnauthorizedException('Votre compte est désactivé');
        }
        await this.userRepository.update(user.id, { lastLoginAt: new Date() });
        const payload = {
            sub: user.id,
            phone: user.phone,
            userType: user.userType,
            adminRole: user.adminRole
        };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                phone: user.phone,
                userType: user.userType,
                status: user.status,
                adminRole: user.adminRole,
                profile: user.profile,
                company: user.company,
            },
            token,
        };
    }
    async validateUser(phone, password) {
        const user = await this.userRepository.findOne({
            where: { phone },
            relations: ['profile'],
        });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async findUserById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['profile', 'company'],
        });
    }
    calculateInitialCompletion(firstName, lastName) {
        let completion = 0;
        if (firstName)
            completion += 10;
        if (lastName)
            completion += 10;
        return completion;
    }
    async refreshToken(userId) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        const payload = {
            sub: user.id,
            phone: user.phone,
            userType: user.userType,
            adminRole: user.adminRole
        };
        const token = this.jwtService.sign(payload);
        return { token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map