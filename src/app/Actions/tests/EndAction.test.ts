import { Status } from "../domain/StautsActions";
import { EndActionUseCase } from "../useCase/EndActionUseCase";
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { boolean, date } from "purify-ts";
import ProductivityCalculationUseCase from "../useCase/ProductivityCalculationUseCase";
import { ActionAlreadyClosedError } from "../domain/errors/ActionAlreadyClosedError";
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError";

let actionRepository: InMemoryActionsRepository;
let dateService: InMemoryDateService;
describe("End an action", () => {
    beforeEach(() => {
        actionRepository = new InMemoryActionsRepository();
        dateService = new InMemoryDateService();
    });

    it("should change the satus to ended", async () => {
        const props = {
            __id: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().build())];

        await new EndActionUseCase(actionRepository, dateService).execute(props);

        expect(actionRepository.savedWith[0]?.toState().status).toEqual(Status.ENDED);
    });
    it("should change the have a end time", async () => {
        const props = {
            __id: 1,
            bonne: 100,
            rebut: 10,
        };

        dateService.nowDate = new Date(2023, 6, 6);
        actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().build())];

        await new EndActionUseCase(actionRepository, dateService).execute(props);

        expect(actionRepository.savedWith[0]?.toState().end)
            .toEqual(new ActionBuilder().withEnd(dateService.now())
                .build()
                .toState()
                .end
        );
    });
    it("should return an error if the __id doesn't existe", async () => {
        const props = {
            __id: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
        ];

        const sut  = await new EndActionUseCase(actionRepository, dateService).execute(props)

        expect(sut.extract()).toEqual(new ActionNotFoundError())
    });
    it("should return an error if the action is already closed", async () => {
        const props = {
            __id: 1,
            bonne: 100,
            rebut: 10,
        };

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(1).withEnd(new Date()).build()),
        ];

        const sut  = await new EndActionUseCase(actionRepository, dateService).execute(props)

        expect(sut.extract()).toEqual(new ActionAlreadyClosedError(1))
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
        "should stop an action and calculate the time passed expected : $expected seconde",
        async ({ actual, inMemory, expected }) => {
            const props = {
                __id: 1,
                bonne: 100,
                rebut: 10,
            };
            // const dateTime = inMemory.getTime()
            // const diff = inMemory.getTimezoneOffset()

            dateService.nowDate = actual;
            actionRepository.datas = [
                ActionsMapper.toRepository(new ActionBuilder().withStart(inMemory).build()),
            ];

            await new EndActionUseCase(actionRepository, dateService).execute(props);

            expect(actionRepository.savedWith[0]?.toState().timeSeconde).toEqual(expected);
        }
    );

    it.each([
        {
            props: {
                __id: 1,
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
                __id: 1,
                bonne: 100,
            },
            expected: {
                bonne: 100,
                rebut: 0,
            },
        },
        {
            props: {
                __id: 1,
            },
            expected: {
                bonne: 0,
                rebut: 0,
            },
        },
    ])(
        "qty ($props.bonne,$props.rebut) should give ($expected.bonne,$expected.rebut)",
        async ({ props, expected }) => {
            dateService.nowDate = new Date(2023, 6, 6, 15);
            actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().build())];

            await new EndActionUseCase(actionRepository, dateService).execute(props);

            expect(actionRepository.savedWith[0]).toEqual(
                new ActionBuilder()
                    .withBonne(expected.bonne)
                    .withRebut(expected.rebut)
                    .withEnd(dateService.now())
                    .withStatus(Status.ENDED)
                    .build()
            );
        }
    );
    it.todo("should take care of eventually negative value");

});
