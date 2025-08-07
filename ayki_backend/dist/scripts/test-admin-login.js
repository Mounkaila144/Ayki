"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../src/entities/user.entity");
const bcrypt = require("bcryptjs");
async function testAdminLogin() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    try {
        console.log('🔍 Recherche de l\'utilisateur admin...');
        const adminUser = await userRepository.findOne({
            where: { phone: '90000000' },
            relations: ['profile', 'company'],
        });
        if (!adminUser) {
            console.log('❌ Aucun utilisateur trouvé avec le téléphone 90000000');
            await app.close();
            return;
        }
        console.log('✅ Utilisateur trouvé:');
        console.log('📱 Téléphone:', adminUser.phone);
        console.log('👤 Type:', adminUser.userType);
        console.log('📊 Statut:', adminUser.status);
        console.log('🛡️ Rôle admin:', adminUser.adminRole);
        console.log('🔑 Hash du mot de passe:', adminUser.password.substring(0, 20) + '...');
        console.log('\n🔐 Test du mot de passe "admin123"...');
        const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
        if (isPasswordValid) {
            console.log('✅ Mot de passe correct !');
        }
        else {
            console.log('❌ Mot de passe incorrect !');
            console.log('\n🔧 Création d\'un nouveau hash pour "admin123"...');
            const newHash = await bcrypt.hash('admin123', 12);
            console.log('Nouveau hash:', newHash);
            const newHashValid = await bcrypt.compare('admin123', newHash);
            console.log('Test nouveau hash:', newHashValid ? '✅ Valide' : '❌ Invalide');
        }
        if (adminUser.profile) {
            console.log('\n👤 Profil:');
            console.log('Nom:', adminUser.profile.firstName, adminUser.profile.lastName);
            console.log('Email:', adminUser.profile.email);
        }
        else {
            console.log('\n❌ Aucun profil trouvé');
        }
    }
    catch (error) {
        console.error('❌ Erreur:', error);
    }
    finally {
        await app.close();
    }
}
testAdminLogin();
//# sourceMappingURL=test-admin-login.js.map