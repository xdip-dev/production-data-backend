import { Injectable } from '@nestjs/common';
import { ProductionRepository } from '@/step-production/domain/port/ProductionRepository';
import { DateService } from '@/step-production/domain/port/DateService';
import { NotFoundError } from '@/step-production/domain/errors/NotFoundError';
import { AlreadyClosedError } from '@/step-production/domain/errors/AlreadyClosedError';
import { Err, Ok, Result } from '../../../shared/result';

interface Props {
    stepId: number;
}

@Injectable()
export class CancelStepUseCase {
    constructor(
        private productionRepository: ProductionRepository,
        private dateService: DateService,
    ) {}

    public async execute(props: Props): Promise<Result<void, NotFoundError | AlreadyClosedError>> {
        const stepProductionExisting = await this.productionRepository.getStepById(props.stepId);
        if (!stepProductionExisting) {
            return Err.of(new NotFoundError());
        }
        const CancellingResponse = stepProductionExisting.cancelAction(this.dateService);
        if (CancellingResponse.isErr()) {
            return Err.of(CancellingResponse.error);
        }
        await this.productionRepository.save(stepProductionExisting);
        return Ok.of(undefined);
    }
}
