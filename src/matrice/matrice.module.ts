import { Module } from '@nestjs/common';
import { MatriceController } from './matrice.controller';
import { MatriceService } from './matrice.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/PrismaService';
import { MatriceRepository } from './domain/port/MatriceRepository';
import { PrismaMatriceRepository } from './infrastructure/adapters/repository/PrismaMatriceRepository';

@Module({
    controllers: [MatriceController],
    providers: [
        MatriceService,
        { provide: PrismaClient, useClass: PrismaService },
        {
            provide: MatriceRepository,
            useClass: PrismaMatriceRepository,
        },
    ],
})
export class MatriceModule {}
