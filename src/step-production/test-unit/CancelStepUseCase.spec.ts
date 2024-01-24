import { StepBuilder } from '@/step-production/domain/core/StepBuilder';
import { Status } from '@/step-production/domain/core/StepStatus';
import { AlreadyClosedError } from '@/step-production/domain/errors/AlreadyClosedError';
import { NotFoundError } from '@/step-production/domain/errors/NotFoundError';
import { InMemoryDateService } from '@/step-production/infrastructure/adapters/date/InMemoryDateService';
import { InMemoryProductionRepository } from '@/step-production/infrastructure/adapters/repositories/InMemoryProductionRepository';
import { StepProductionMapper } from '@/step-production/infrastructure/adapters/repositories/StepProductionMapper';
import { CancelStepUseCase } from '@/step-production/use-cases/step-production/CancelStepUseCase';

let actionRepository: InMemoryProductionRepository;
let dateService: InMemoryDateService;

describe('Production Management ASM', () => {
    beforeEach(() => {
        actionRepository = new InMemoryProductionRepository();
        dateService = new InMemoryDateService();
    });

    it('should cancel a step in progress', async () => {
        dateService.nowDate = new Date(2023, 6, 6, 15);

        actionRepository.datas = [
            StepProductionMapper.toRepository(
                new StepBuilder().withStatus(Status.IN_PROGRESS).build(),
            ),
        ];

        await new CancelStepUseCase(actionRepository, dateService).execute({
            stepId: 1,
        });

        expect(actionRepository.savedWith[0]).toEqual(
            new StepBuilder()
                .withStatus(Status.CANCELED)
                .withEnd(dateService.now())
                .withProductivity(null)
                .withTimeSeconde(null)
                .build(),
        );
    });

    it('should throw an error if Id not found', async () => {
        let errorMessage = new Error();

        const props = {
            stepId: 1,
        };

        actionRepository.datas = [
            StepProductionMapper.toRepository(new StepBuilder().withId(2).build()),
        ];

        const sut = await new CancelStepUseCase(actionRepository, dateService).execute(props);

        if (sut.isErr()) errorMessage = sut.error;

        expect(errorMessage).toEqual(new NotFoundError());
    });
    it('should throw an error if action is already closed', async () => {
        let errorMessage = new Error();

        const props = {
            stepId: 1,
        };

        actionRepository.datas = [
            StepProductionMapper.toRepository(
                new StepBuilder().withId(1).withEnd(new Date()).build(),
            ),
        ];

        const sut = await new CancelStepUseCase(actionRepository, dateService).execute(props);
        if (sut.isErr()) errorMessage = sut.error;

        expect(errorMessage).toEqual(new AlreadyClosedError(1));
    });
});
