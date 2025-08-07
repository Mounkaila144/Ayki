import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { entities } from '../entities';
import { seedInitialData } from './seeds/initial-data.seed';

// Load environment variables
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', 'password'),
  database: configService.get('DB_NAME', 'ayki_db'),
  entities,
  synchronize: true,
  logging: false,
  charset: 'utf8mb4',
  timezone: '+00:00',
});

async function runSeeds() {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    console.log('🌱 Exécution des seeds...');
    await seedInitialData(AppDataSource);

    console.log('✅ Seeds exécutés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des seeds:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connexion fermée');
  }
}

runSeeds();
