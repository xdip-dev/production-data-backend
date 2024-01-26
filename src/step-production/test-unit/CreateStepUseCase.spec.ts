import { StepBuilder } from '@/step-production/domain/core/StepBuilder';
import { Status } from '@/step-production/domain/core/StepStatus';
import { AlreadyOpennedError } from '@/step-production/domain/errors/AlreadyOpennedError';
import { InMemoryDateService } from '@/step-production/infrastructure/adapters/date/InMemoryDateService';
import { InMemoryProductionRepository } from '@/step-production/infrastructure/adapters/repositories/InMemoryProductionRepository';
import { StepProductionMapper } from '@/step-production/infrastructure/adapters/repositories/StepProductionMapper';
import { CreateStepUseCase } from '@/step-production/use-cases/step-production/CreateStepUseCase';

let actionRepository: InMemoryProductionRepository;
let dateService: InMemoryDateService;

describe('Production Management', () => {
    beforeEach(() => {
        actionRepository = new InMemoryProductionRepository();
        dateService = new InMemoryDateService();
    });
    it('should create an action into the repository with a start date', async () => {
        dateService.nowDate = new Date(2022, 6, 6);

        await new CreateStepUseCase(actionRepository, dateService).execute({
            operatorId: '1244',
            action: 'asm',
            model: 'ref',
        });

        expect(actionRepository.savedWith[0]).toEqual(
            new StepBuilder().withStart(dateService.now()).build(),
        );
    });
    it('should write the optional argument of previousAction, ref', async () => {
        dateService.nowDate = new Date(2022, 6, 6);

        await new CreateStepUseCase(actionRepository, dateService).execute({
            operatorId: '1244',
            action: 'asm',
            model: 'ref',
            previousStepsIds: [1243],
            reference: 'ref',
        });

        expect(actionRepository.savedWith[0]).toEqual(
            new StepBuilder()
                .withPreviousStepIds([1243])
                .withReference('ref')
                .withStart(dateService.now())
                .build(),
        );
    });

    it('should save only once the data on creation', async () => {
        await new CreateStepUseCase(actionRepository, dateService).execute({
            operatorId: '1244',
            action: 'asm',
            model: 'ref',
        });

        expect(actionRepository.savedWith.length).toEqual(1);
    });

    it('should throw an error if the last action is already started', async () => {
        let errorMessage = new Error();
        actionRepository.datas = [StepProductionMapper.toRepository(new StepBuilder().build())];
        const sut = await new CreateStepUseCase(actionRepository, dateService).execute({
            operatorId: '1244',
            action: 'asm',
            model: 'ref',
        });
        if (sut.isErr()) errorMessage = sut.error;
        expect(errorMessage).toEqual(new AlreadyOpennedError(1));
    });
    it('should NOT throw an error if the last action is not started', async () => {
        dateService.nowDate = new Date(2022, 6, 6);

        actionRepository.datas = [
            StepProductionMapper.toRepository(
                new StepBuilder().withId(1).withStatus(Status.ENDED).build(),
            ),
            StepProductionMapper.toRepository(
                new StepBuilder().withId(2).withStatus(Status.CANCELED).build(),
            ),
        ];
        await new CreateStepUseCase(actionRepository, dateService).execute({
            operatorId: '1244',
            action: 'asm',
            model: 'ref',
        });

        expect(actionRepository.savedWith[0]).toEqual(
            new StepBuilder().withId(3).withStart(dateService.now()).build(),
        );
    });
});
