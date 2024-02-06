import { Module } from '@nestjs/common';
import { StepProductionController } from './infrastructure/controllers/StepProductionController';
import { CreateStepUseCase } from './use-cases/step-production/CreateStepUseCase';
import { ProductionRepository } from './domain/port/ProductionRepository';
import { DateService } from './domain/port/DateService';
import { PrismaProductionRepository } from './infrastructure/adapters/repositories/PrismaProductionRepository';
import { RealDateService } from './infrastructure/adapters/date/RealDateService';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../shared/prisma/PrismaService';
import { CancelStepUseCase } from './use-cases/step-production/CancelStepUseCase';
import { EndStepUseCase } from './use-cases/step-production/EndStepUseCase';
import { StepProductionService } from './use-cases/step-production.service';
@Module({
    imports: [],
    controllers: [StepProductionController],
    providers: [
        CreateStepUseCase,
        CancelStepUseCase,
        EndStepUseCase,
        StepProductionService,
        {
            provide: PrismaClient,
            useClass: PrismaService,
        },
        {
            provide: ProductionRepository,
            useClass: PrismaProductionRepository,
        },
        { provide: DateService, useClass: RealDateService },
    ],
})
export class StepProductionModule {}
