import { Module } from '@nestjs/common';
import { ErpService } from './ErpService';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { ErpController } from './ErpController';
import { InMemoryErpService } from './InMemoryErpService';

@Module({
    controllers: [ErpController],
    providers: [
        { provide: ErpService, useClass: InMemoryErpService },
        {
            provide: 'DATABASE_POOL',
            useFactory: async (configService: ConfigService) => {
                return new Pool({
                    user: configService.get('DB_ERP_USER'),
                    host: configService.get('DB_ERP_HOST'),
                    database: configService.get('DB_ERP_DATABASE'),
                    password: configService.get('DB_ERP_PASSWORD'),
                    port: +configService.get('DB_ERP_PORT'),
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class ErpModule {}
