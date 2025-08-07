"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../src/entities/user.entity");
const user_profile_entity_1 = require("../src/entities/user-profile.entity");
const bcrypt = require("bcryptjs");
async function createAdmin() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const profileRepository = app.get((0, typeorm_1.getRepositoryToken)(user_profile_entity_1.UserProfile));
    try {
        const existingAdmin = await userRepository.findOne({
            where: { adminRole: user_entity_1.AdminRole.SUPER_ADMIN }
        });
        if (existingAdmin) {
            console.log('Un super admin existe déjà:', existingAdmin.phone);
            await app.close();
            return;
        }
        const hashedPassword = await bcrypt.hash('ptr144', 12);
        const adminUser = userRepository.create({
            phone: '90000000',
            password: hashedPassword,
            userType: user_entity_1.UserType.RECRUITER,
            status: user_entity_1.UserStatus.ACTIVE,
            adminRole: user_entity_1.AdminRole.SUPER_ADMIN,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
        });
        const savedUser = await userRepository.save(adminUser);
        const adminProfile = profileRepository.create({
            userId: savedUser.id,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@ayki.com',
            title: 'Administrateur Système',
            profileCompletion: 100,
        });
        await profileRepository.save(adminProfile);
        console.log('✅ Super admin créé avec succès !');
        console.log('📱 Téléphone:', adminUser.phone);
        console.log('🔑 Mot de passe: admin123');
        console.log('👤 Nom:', adminProfile.firstName, adminProfile.lastName);
        console.log('📧 Email:', adminProfile.email);
        console.log('');
        console.log('🚀 Vous pouvez maintenant vous connecter à l\'interface admin avec ces identifiants.');
    }
    catch (error) {
        console.error('❌ Erreur lors de la création de l\'admin:', error);
    }
    finally {
        await app.close();
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map