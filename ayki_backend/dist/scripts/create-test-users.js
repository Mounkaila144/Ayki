"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../src/entities/user.entity");
const user_profile_entity_1 = require("../src/entities/user-profile.entity");
const bcrypt = require("bcryptjs");
async function createTestUsers() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const profileRepository = app.get((0, typeorm_1.getRepositoryToken)(user_profile_entity_1.UserProfile));
    try {
        console.log('🔍 Création d\'utilisateurs de test...');
        const hashedPassword = await bcrypt.hash('test123', 12);
        const candidates = [
            {
                phone: '91234567',
                profile: {
                    firstName: 'Aminata',
                    lastName: 'Diallo',
                    email: 'aminata.diallo@email.com',
                    title: 'Développeuse Frontend',
                    location: 'Niamey',
                    summary: 'Développeuse passionnée avec 3 ans d\'expérience en React et Vue.js',
                    profileCompletion: 85,
                }
            },
            {
                phone: '92345678',
                profile: {
                    firstName: 'Ibrahim',
                    lastName: 'Moussa',
                    email: 'ibrahim.moussa@email.com',
                    title: 'Data Analyst',
                    location: 'Maradi',
                    summary: 'Analyste de données spécialisé en Python et SQL',
                    profileCompletion: 70,
                }
            },
            {
                phone: '93456789',
                profile: {
                    firstName: 'Fatouma',
                    lastName: 'Ali',
                    email: 'fatouma.ali@email.com',
                    title: 'Designer UX/UI',
                    location: 'Zinder',
                    summary: 'Designer créative avec expertise en Figma et Adobe Creative Suite',
                    profileCompletion: 90,
                }
            },
            {
                phone: '94567890',
                profile: {
                    firstName: 'Ousmane',
                    lastName: 'Garba',
                    email: 'ousmane.garba@email.com',
                    title: 'Ingénieur DevOps',
                    location: 'Tahoua',
                    summary: 'Spécialiste en infrastructure cloud et automatisation',
                    profileCompletion: 75,
                }
            }
        ];
        const recruiters = [
            {
                phone: '95678901',
                profile: {
                    firstName: 'Mariama',
                    lastName: 'Sani',
                    email: 'mariama.sani@techcorp.ne',
                    title: 'Responsable RH',
                    location: 'Niamey',
                    summary: 'Responsable des ressources humaines chez TechCorp Niger',
                    profileCompletion: 95,
                }
            },
            {
                phone: '96789012',
                profile: {
                    firstName: 'Abdou',
                    lastName: 'Issoufou',
                    email: 'abdou.issoufou@innovate.ne',
                    title: 'Directeur Technique',
                    location: 'Niamey',
                    summary: 'CTO d\'une startup technologique en pleine croissance',
                    profileCompletion: 80,
                }
            }
        ];
        for (const candidateData of candidates) {
            const existingUser = await userRepository.findOne({
                where: { phone: candidateData.phone }
            });
            if (!existingUser) {
                const user = userRepository.create({
                    phone: candidateData.phone,
                    password: hashedPassword,
                    userType: user_entity_1.UserType.CANDIDATE,
                    status: user_entity_1.UserStatus.ACTIVE,
                    emailVerifiedAt: new Date(),
                    phoneVerifiedAt: new Date(),
                });
                const savedUser = await userRepository.save(user);
                const profile = profileRepository.create({
                    userId: savedUser.id,
                    ...candidateData.profile,
                });
                await profileRepository.save(profile);
                console.log(`✅ Candidat créé: ${candidateData.profile.firstName} ${candidateData.profile.lastName}`);
            }
            else {
                console.log(`⚠️ Candidat existe déjà: ${candidateData.phone}`);
            }
        }
        for (const recruiterData of recruiters) {
            const existingUser = await userRepository.findOne({
                where: { phone: recruiterData.phone }
            });
            if (!existingUser) {
                const user = userRepository.create({
                    phone: recruiterData.phone,
                    password: hashedPassword,
                    userType: user_entity_1.UserType.RECRUITER,
                    status: user_entity_1.UserStatus.ACTIVE,
                    emailVerifiedAt: new Date(),
                    phoneVerifiedAt: new Date(),
                });
                const savedUser = await userRepository.save(user);
                const profile = profileRepository.create({
                    userId: savedUser.id,
                    ...recruiterData.profile,
                });
                await profileRepository.save(profile);
                console.log(`✅ Recruteur créé: ${recruiterData.profile.firstName} ${recruiterData.profile.lastName}`);
            }
            else {
                console.log(`⚠️ Recruteur existe déjà: ${recruiterData.phone}`);
            }
        }
        console.log('\n🎉 Utilisateurs de test créés avec succès !');
        console.log('🔑 Mot de passe pour tous les comptes de test: test123');
    }
    catch (error) {
        console.error('❌ Erreur lors de la création des utilisateurs de test:', error);
    }
    finally {
        await app.close();
    }
}
createTestUsers();
//# sourceMappingURL=create-test-users.js.map