import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { Status } from "../domain/StautsActions";
import { CancelActionUseCase } from "../useCase/CancelActionUseCase";
import { ActionAlreadyClosedError } from "../domain/errors/ActionAlreadyClosedError";
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError";

let actionRepository:InMemoryActionsRepository
let dateService:InMemoryDateService

describe("Production Management ASM", () => {
    beforeEach(() => {
        actionRepository=new InMemoryActionsRepository()
        dateService=new InMemoryDateService()
    })

    it('should cancel and action',async () => {
        dateService.nowDate = new Date(2023, 6, 6,15);

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().build()),
        ];

        await new CancelActionUseCase(actionRepository,dateService).execute({
            __id: 1,
        });


        expect(actionRepository.savedWith[0])
            .toEqual(new ActionBuilder().withStatus(Status.CANCELED)
                .withEnd(new Date(2023, 6, 6,15))
                .withProductivity(null)
                .withTimeSeconde(null)
                .build())
    })

    it('should throw an error if Id not found',async() => {
        const props = {
            __id: 1,
        };

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
        ];

        const sut = await new CancelActionUseCase(actionRepository, dateService).execute(props)
        
        expect(sut.extract()).toEqual(new ActionNotFoundError())
    })
    it('should throw an error if action is already closed',async() => {
        const props = {
            __id: 1,
        };

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(1).withEnd(new Date()).build()),
        ];

        const sut = await new CancelActionUseCase(actionRepository, dateService).execute(props)
        
        expect(sut.extract()).toEqual(new ActionAlreadyClosedError(1))
    })
})