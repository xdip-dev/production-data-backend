import { Injectable } from '@nestjs/common';
import { StepProduction } from '../core/StepProduction';

export type StepProductionWithActionName = StepProduction['props'] & { actionName: string };

@Injectable()
export abstract class ProductionRepository {
    abstract save(props: StepProduction): Promise<void>;
    abstract getLastActiveStepByOperatorId(
        operatorId: string,
    ): Promise<StepProductionWithActionName | null>;
    abstract getLastStepId(): Promise<number | null>;
    abstract getStepById(id: number): Promise<StepProduction | null>;
}
