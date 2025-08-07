import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function testAdminLogin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  try {
    console.log('🔍 Recherche de l\'utilisateur admin...');
    
    // Chercher l'utilisateur admin
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

    // Tester le mot de passe
    console.log('\n🔐 Test du mot de passe "admin123"...');
    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
    
    if (isPasswordValid) {
      console.log('✅ Mot de passe correct !');
    } else {
      console.log('❌ Mot de passe incorrect !');
      
      // Créer un nouveau hash pour comparaison
      console.log('\n🔧 Création d\'un nouveau hash pour "admin123"...');
      const newHash = await bcrypt.hash('admin123', 12);
      console.log('Nouveau hash:', newHash);
      
      // Tester le nouveau hash
      const newHashValid = await bcrypt.compare('admin123', newHash);
      console.log('Test nouveau hash:', newHashValid ? '✅ Valide' : '❌ Invalide');
    }

    // Informations du profil
    if (adminUser.profile) {
      console.log('\n👤 Profil:');
      console.log('Nom:', adminUser.profile.firstName, adminUser.profile.lastName);
      console.log('Email:', adminUser.profile.email);
    } else {
      console.log('\n❌ Aucun profil trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await app.close();
  }
}

testAdminLogin();
