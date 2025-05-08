require('dotenv').config();
const { DataSource } = require('typeorm');
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: ['src/models/entities/*.entity{.ts,.js}'],
    migrations: ['src/models/migrations/*{.ts,.js}'],
    synchronize: false,
    autoLoadEntities: true,
    migrationsTableName: 'typeorm_migration_table',
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    cli: {
        migrationsDir: 'src/models/migrations',
    },
});
