import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  database: process.env.DB_NAME || 'ayki_db',
  password: process.env.DB_PASSWORD || '',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});