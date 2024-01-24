import { Injectable } from '@nestjs/common';
import { StepProduction } from '../core/StepProduction';

@Injectable()
export abstract class ProductionRepository {
    abstract save(props: StepProduction): Promise<void>;
    abstract getLastStepByOperatorId(operatorId: number): Promise<StepProduction | null>;
    abstract getLastStepId(): Promise<number | null>;
    abstract getStepById(id: number): Promise<StepProduction | null>;
}
