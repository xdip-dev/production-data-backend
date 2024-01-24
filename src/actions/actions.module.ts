import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/PrismaService';
import { ActionController } from './actions.controller';
import { ActionService } from './actions.service';
import { ActionRepository } from './domain/port/ActionsRepository';
import { PrismaActionRepository } from './infrastructure/adapters/repository/PrismaActionRepository';

@Module({
    controllers: [ActionController],
    providers: [
        ActionService,
        { provide: PrismaClient, useClass: PrismaService },
        {
            provide: ActionRepository,
            useClass: PrismaActionRepository,
        },
    ],
})
export class ActionModule {}
