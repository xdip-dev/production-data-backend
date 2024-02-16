import { StepProduction } from '@/step-production/domain/core/StepProduction';
import {
    ProductionRepository,
    StepProductionWithActionName,
} from '@/step-production/domain/port/ProductionRepository';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StepProductionMapper } from './StepProductionMapper';
import { Status } from '@/step-production/domain/core/StepStatus';

@Injectable()
export class PrismaProductionRepository implements ProductionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(props: StepProduction): Promise<void> {
        await this.prisma.stepProduction.upsert({
            where: { STEP_ID: props.toState().stepId },
            create: StepProductionMapper.toRepository(props),
            update: StepProductionMapper.toRepository(props),
        });
    }
    async getLastActiveStepByOperatorId(
        operatorId: string,
    ): Promise<StepProductionWithActionName | null> {
        const data = await this.prisma.stepProduction.findFirst({
            where: { OPERATOR_ID: operatorId, STATUS: Status.IN_PROGRESS },
            include: { action: true },
        });
        if (!data) {
            return null;
        }
        const step = StepProductionMapper.toDomain(data);
        return { ...step.toState(), actionName: data.action.NAME };
    }
    async getLastStepId(): Promise<number | null> {
        return await this.prisma.stepProduction
            .findFirst({ orderBy: { STEP_ID: 'desc' } })
            .then((data) => data?.STEP_ID ?? null);
    }
    async getStepById(id: number): Promise<StepProduction | null> {
        const data = await this.prisma.stepProduction.findFirst({
            where: { STEP_ID: id },
        });
        if (!data) {
            return null;
        }
        return StepProductionMapper.toDomain(data);
    }
}
