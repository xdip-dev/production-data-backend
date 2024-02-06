import { Injectable } from '@nestjs/common';
import { StepProduction } from '../domain/core/StepProduction';
import { ProductionRepository } from '../domain/port/ProductionRepository';

@Injectable()
export class StepProductionService {
    constructor(private readonly productionRepository: ProductionRepository) {}

    async getStepById(id: number): Promise<StepProduction['props'] | null> {
        const step = await this.productionRepository.getStepById(id);
        return step?.toState() ?? null;
    }

    async getLastStepByOperatorId(operatorId: string): Promise<StepProduction['props'] | null> {
        const step = await this.productionRepository.getLastStepByOperatorId(operatorId);
        return step?.toState() ?? null;
    }
}
