import { Injectable } from '@nestjs/common';
import { DateService } from '@/step-production/domain/port/DateService';
import { NotFoundError } from '@/step-production/domain/errors/NotFoundError';
import { AlreadyClosedError } from '@/step-production/domain/errors/AlreadyClosedError';
import { ProductionRepository } from '@/step-production/domain/port/ProductionRepository';
import { Err, Ok, Result } from '@/shared/result';

interface Props {
    stepId: number;
    bonne?: number;
    rebut?: number;
    actionProblem?: string;
}

@Injectable()
export class EndStepUseCase {
    constructor(
        private productionRepository: ProductionRepository,
        private dateService: DateService,
    ) {}

    public async execute(props: Props): Promise<Result<void, NotFoundError | AlreadyClosedError>> {
        const matchAction = await this.productionRepository.getStepById(props.stepId);
        if (!matchAction) {
            return Err.of(new NotFoundError());
        }
        const endStepResponse = matchAction.setEndOfAction(
            this.dateService,
            props.bonne,
            props.rebut,
            props.actionProblem,
        );
        if (endStepResponse.isErr()) {
            return Err.of(endStepResponse.error);
        }

        await this.productionRepository.save(matchAction);
        return Ok.of(undefined);
    }
}
