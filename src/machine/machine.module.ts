import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/PrismaService';
import { MachineRepository } from './domain/port/MachineRepository';
import { PrismaMachineRepository } from './infrastructure/adapters/repository/PrismaMachineRepository';

@Module({
    controllers: [MachineController],
    providers: [
        MachineService,
        { provide: PrismaClient, useClass: PrismaService },
        {
            provide: MachineRepository,
            useClass: PrismaMachineRepository,
        },
    ],
})
export class MachineModule {}
