import { StepBuilder } from '@/step-production/domain/core/StepBuilder';
import { Status } from '@/step-production/domain/core/StepStatus';
import { AlreadyClosedError } from '@/step-production/domain/errors/AlreadyClosedError';
import { NotFoundError } from '@/step-production/domain/errors/NotFoundError';
import { InMemoryDateService } from '@/step-production/infrastructure/adapters/date/InMemoryDateService';
import { InMemoryProductionRepository } from '@/step-production/infrastructure/adapters/repositories/InMemoryProductionRepository';
import { StepProductionMapper } from '@/step-production/infrastructure/adapters/repositories/StepProductionMapper';
import { EndStepUseCase } from '@/step-production/use-cases/step-production/EndStepUseCase';

let actionRepository: InMemoryProductionRepository;
let dateService: InMemoryDateService;
describe('End an action', () => {
    beforeEach(() => {
        actionRepository = new InMemoryProductionRepository();
        dateService = new InMemoryDateService();
    });

    it('should change the satus to ended', async () => {
        const props = {
            stepId: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [StepProductionMapper.toRepository(new StepBuilder().build())];

        await new EndStepUseCase(actionRepository, dateService).execute(props);

        expect(actionRepository.savedWith[0]?.toState().status).toEqual(Status.ENDED);
    });
    it('should change the have a end time', async () => {
        const props = {
            stepId: 1,
            bonne: 100,
            rebut: 10,
        };

        dateService.nowDate = new Date(2023, 6, 6);
        actionRepository.datas = [StepProductionMapper.toRepository(new StepBuilder().build())];

        await new EndStepUseCase(actionRepository, dateService).execute(props);

        expect(actionRepository.savedWith[0]?.toState().end).toEqual(
            new StepBuilder().withEnd(dateService.now()).build().toState().end,
        );
    });
    it('should set problem if any', async () => {
        const props = {
            stepId: 1,
            actionProblem: 'problem',
        };

        dateService.nowDate = new Date(2023, 6, 6);
        actionRepository.datas = [StepProductionMapper.toRepository(new StepBuilder().build())];

        await new EndStepUseCase(actionRepository, dateService).execute(props);

        expect(actionRepository.savedWith[0]?.toState().stepProblem).toEqual(
            new StepBuilder().withStepProblem('problem').build().toState().stepProblem,
        );
    });
    it("should return an error if the stepId doesn't existe", async () => {
        let errorMessage = new Error();

        const props = {
            stepId: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [
            StepProductionMapper.toRepository(new StepBuilder().withId(2).build()),
        ];

        const sut = await new EndStepUseCase(actionRepository, dateService).execute(props);
        if (sut.isErr()) errorMessage = sut.error;

        expect(errorMessage).toEqual(new NotFoundError());
    });
    it('should return an error if the action is already closed', async () => {
        let errorMessage = new Error();

        const props = {
            stepId: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [
            StepProductionMapper.toRepository(
                new StepBuilder().withId(1).withEnd(new Date()).build(),
            ),
        ];

        const sut = await new EndStepUseCase(actionRepository, dateService).execute(props);
        if (sut.isErr()) errorMessage = sut.error;

        expect(errorMessage).toEqual(new AlreadyClosedError(1));
    });
    it.each([
        {
            actual: new Date(2023, 6, 6, 18),
            inMemory: new Date(2023, 6, 6, 15),
            expected: 10800,
        },
        {
            actual: new Date(2023, 6, 6, 18),
            inMemory: new Date(2023, 6, 5, 18),
            expected: 86400,
        },
        {
            actual: new Date(2023, 6, 6, 18, 1),
            inMemory: new Date(2023, 6, 6, 18, 0),
            expected: 60,
        },
        {
            actual: new Date(2023, 6, 6, 18, 1, 1),
            inMemory: new Date(2023, 6, 6, 18, 1, 0),
            expected: 1,
        },
    ])(
        'should stop an action and calculate the time passed expected : $expected seconde',
        async ({ actual, inMemory, expected }) => {
            const props = {
                stepId: 1,
                bonne: 100,
                rebut: 10,
            };

            dateService.nowDate = actual;
            actionRepository.datas = [
                StepProductionMapper.toRepository(new StepBuilder().withStart(inMemory).build()),
            ];

            await new EndStepUseCase(actionRepository, dateService).execute(props);

            expect(actionRepository.savedWith[0]?.toState().timeSeconde).toEqual(expected);
        },
    );

    it.each([
        {
            props: {
                stepId: 1,
                bonne: 100,
                rebut: 10,
            },
            expected: {
                bonne: 100,
                rebut: 10,
            },
        },
        {
            props: {
                stepId: 1,
                bonne: 100,
            },
            expected: {
                bonne: 100,
                rebut: 0,
            },
        },
        {
            props: {
                stepId: 1,
            },
            expected: {
                bonne: 0,
                rebut: 0,
            },
        },
        {
            props: {
                stepId: 1,
                bonne: -100,
                rebut: -10,
            },
            expected: {
                bonne: 0,
                rebut: 0,
            },
        },
    ])(
        'qty ($props.bonne,$props.rebut) should give ($expected.bonne,$expected.rebut)',
        async ({ props, expected }) => {
            dateService.nowDate = new Date(2023, 6, 6, 15);
            actionRepository.datas = [StepProductionMapper.toRepository(new StepBuilder().build())];

            await new EndStepUseCase(actionRepository, dateService).execute(props);

            expect(actionRepository.savedWith[0]).toEqual(
                new StepBuilder()
                    .withBonne(expected.bonne)
                    .withRebut(expected.rebut)
                    .withEnd(dateService.now())
                    .withStatus(Status.ENDED)
                    .build(),
            );
        },
    );
});
