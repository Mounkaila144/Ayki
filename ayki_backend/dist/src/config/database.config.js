"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const entities_1 = require("../entities");
const getDatabaseConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', 'password'),
    database: configService.get('DB_NAME', 'ayki_db'),
    entities: entities_1.entities,
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    charset: 'utf8mb4',
    timezone: '+00:00',
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map