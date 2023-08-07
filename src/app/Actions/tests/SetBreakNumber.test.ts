import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { ActionBuilder } from "../domain/ActionBuilder";
import { SetBreakNumberUseCase } from "../useCase/Action/SetBreakNumberUseCase";

let actionRepository : InMemoryActionsRepository;
let dateService : InMemoryDateService;
describe("Set break number", () => {

    beforeEach(() => {
        actionRepository = new InMemoryActionsRepository();
        dateService = new InMemoryDateService();
    });
    it.each([
        {start:new Date(2023,6,30,9,45,0),end:new Date(2023,6,30,10,45,0),expectedBreakNumber:0},
        {start:new Date(2023,6,30,8,45,0),end:new Date(2023,6,30,10,45,0),expectedBreakNumber:1},
        {start:new Date(2023,6,30,11,20,0),end:new Date(2023,6,30,11,45,0),expectedBreakNumber:0},
        {start:new Date(2023,6,30,7,45,0),end:new Date(2023,6,30,13,45,0),expectedBreakNumber:3},
        {start:new Date(2023,6,30,7,0,0),end:new Date(2023,6,30,15,0,0),expectedBreakNumber:3},
        {start:new Date(2023,6,30,7,0,0),end:new Date(2023,6,31,15,0,0),expectedBreakNumber:6},
    ])("should set break number to expected : $expectedBreakNumber", async({start,end,expectedBreakNumber}) => {
        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder()
                .withId(1)
                .withStart(start)
                .withEnd(end)
                .build()),
        ]

        await new SetBreakNumberUseCase(actionRepository).execute({actionId:1})

        expect(actionRepository.savedWith[0].toState().breakNumber).toBe(expectedBreakNumber)
    })
})