import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';

export const DADDY_PAY_DB = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
        type: 'postgres',
        port:config.get('PG_PORT'),
        host: String(config.get('PG_HOST')),
        username: String(config.get('PG_USER')),
        password: String(config.get('PG_PASSWORD')),
        database: String(config.get('PG_DATABASE')),
        synchronize: false,
        autoLoadEntities: true,
        entities: [resolve(__dirname, '../models/entities/*.entity{.ts,.js}')],
        migrations: [resolve(__dirname, '../models/migration/*{.ts,.js}')],
        migrationsTableName: 'typeorm_migration_table',
        extra: {
            charset: 'utf8mb4_unicode_ci',
        },
        logging: false,
    }),
    inject: [ConfigService],
});

