"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const entities_1 = require("../entities");
const initial_data_seed_1 = require("./seeds/initial-data.seed");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', 'password'),
    database: configService.get('DB_NAME', 'ayki_db'),
    entities: entities_1.entities,
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
        await (0, initial_data_seed_1.seedInitialData)(AppDataSource);
        console.log('✅ Seeds exécutés avec succès !');
    }
    catch (error) {
        console.error('❌ Erreur lors de l\'exécution des seeds:', error);
    }
    finally {
        await AppDataSource.destroy();
        console.log('🔌 Connexion fermée');
    }
}
runSeeds();
//# sourceMappingURL=seed.js.map