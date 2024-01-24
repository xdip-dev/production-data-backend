import { StepProduction } from '@/step-production/domain/core/StepProduction';
import { ProductionRepository } from '@/step-production/domain/port/ProductionRepository';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StepProductionMapper } from './StepProductionMapper';

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
    async getLastStepByOperatorId(operatorId: number): Promise<StepProduction | null> {
        const data = await this.prisma.stepProduction.findFirst({
            where: { OPERATOR_ID: operatorId },
        });
        if (!data) {
            return null;
        }
        return StepProductionMapper.toDomain(data);
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
