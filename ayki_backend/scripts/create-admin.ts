import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserType, UserStatus, AdminRole } from '../src/entities/user.entity';
import { UserProfile } from '../src/entities/user-profile.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const profileRepository = app.get<Repository<UserProfile>>(getRepositoryToken(UserProfile));

  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await userRepository.findOne({
      where: { adminRole: AdminRole.SUPER_ADMIN }
    });

    if (existingAdmin) {
      console.log('Un super admin existe déjà:', existingAdmin.phone);
      await app.close();
      return;
    }

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash('ptr144', 12);

    const adminUser = userRepository.create({
      phone: '90000000', // Numéro de test (format Niger : 8 chiffres)
      password: hashedPassword,
      userType: UserType.RECRUITER,
      status: UserStatus.ACTIVE,
      adminRole: AdminRole.SUPER_ADMIN,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    });

    const savedUser = await userRepository.save(adminUser);

    // Créer le profil admin
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

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await app.close();
  }
}

createAdmin();
