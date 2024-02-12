import { Injectable } from '@nestjs/common';
import { AlreadyOpennedError } from '../../domain/errors/AlreadyOpennedError';
import { StepProduction } from '../../domain/core/StepProduction';
import { ProductionRepository } from '../../domain/port/ProductionRepository';
import { DateService } from '@/step-production/domain/port/DateService';
import { Err, Ok, Result } from '../../../shared/result';

interface Props {
    operatorId: string;
    action: number;
    model: string;
    previousStepsIds?: number[];
    reference?: string;
}

@Injectable()
export class CreateStepUseCase {
    constructor(
        private readonly productionRepository: ProductionRepository,
        private readonly dateService: DateService,
    ) {}

    public async execute(props: Props): Promise<Result<void, AlreadyOpennedError>> {
        const lastIdRepository = await this.productionRepository.getLastStepId();
        let id: number;
        if (!lastIdRepository) {
            id = 1;
        } else {
            id = lastIdRepository + 1;
        }

        const actionCreated = StepProduction.create({
            stepId: id,
            operatorId: props.operatorId,
            model: props.model,
            action: props.action,
            dateService: this.dateService,
            previousStepsIds: props.previousStepsIds,
            reference: props.reference,
        });
        const actionExistingForOperator =
            await this.productionRepository.getLastActiveStepByOperatorId(props.operatorId);

        if (actionExistingForOperator) {
            return Err.of(new AlreadyOpennedError(actionExistingForOperator.toState().stepId));
        }

        await this.productionRepository.save(actionCreated);

        return Ok.of(undefined);
    }
}
