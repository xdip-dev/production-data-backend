import { StepProductionMapper } from './StepProductionMapper';
import { ModelProductionRepository } from './ModelProductionRepository';
import { Injectable } from '@nestjs/common';
import { ProductionRepository } from '@/step-production/domain/port/ProductionRepository';
import { StepProduction } from '@/step-production/domain/core/StepProduction';

Injectable();
export class InMemoryProductionRepository implements ProductionRepository {
    public datas: ModelProductionRepository[] = [];
    public savedWith: StepProduction[] = [];

    public async save(props: StepProduction): Promise<void> {
        this.savedWith.push(props);
    }

    public async getLastStepId(): Promise<number | null> {
        let matchingAction: null | ModelProductionRepository = null;
        let highestId = 0;

        for (const data of this.datas) {
            if (data.STEP_ID > highestId) {
                matchingAction = data;
                highestId = data.STEP_ID;
            }
        }

        if (!matchingAction) {
            return null;
        }
        return highestId;
    }

    public async getLastStepByOperatorId(
        operatorId: number,
    ): Promise<StepProduction | null> {
        let matchingAction: null | ModelProductionRepository = null;
        let highestId = 0;

        for (const data of this.datas) {
            if (data.OPERATOR_ID === operatorId && data.STEP_ID > highestId) {
                matchingAction = data;
                highestId = data.STEP_ID;
            }
        }

        if (!matchingAction) {
            return null;
        }
        return StepProductionMapper.toDomain(matchingAction);
    }

    public async getStepById(id: number): Promise<StepProduction | null> {
        const action = this.datas.find((data) => data.STEP_ID === id);

        if (!action) {
            return null;
        }

        return StepProductionMapper.toDomain(action);
    }
}
