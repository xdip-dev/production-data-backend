import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { CreateActionUseCase } from "../useCase/Action/CreateActionUseCase";
import { ActionAlreadyOpennedError } from "../domain/errors/ActionAlreadyOpennedError";
import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { IdGenerator } from "../../shared/id-generator/IdGenerator";
import { InMemoryIdGenerator } from "../../shared/id-generator/InMemoryIdGenerator";
import { Status } from "../domain/StautsActions";

let actionRepository:InMemoryActionsRepository
let dateService:InMemoryDateService
let idGenerator:InMemoryIdGenerator

describe("Production Management", () => {
    beforeEach(() => {
        actionRepository=new InMemoryActionsRepository()
        dateService=new InMemoryDateService()
        idGenerator = new InMemoryIdGenerator()
    })
    it("should create an action into the repository with a start date", async () => {
        dateService.nowDate = new Date(2022,6,6)

        await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: 1244,
            action: "asm",
            model: "ref",
        });


        expect(actionRepository.savedWith[0]).toEqual(new ActionBuilder().withStart(dateService.now()).build())
        
    });
    it("should write the optional argument of previousAction", async () => {
        dateService.nowDate = new Date(2022,6,6)

        await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: 1244,
            action: "asm",
            model: "ref",
            previousAction:1243
        });


        expect(actionRepository.savedWith[0]).toEqual(new ActionBuilder().withPreviousAction(1243).withStart(dateService.now()).build())
        
    });
    
    it("should save only once the data on creation", async () => {
        await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: 1244,
            action: "asm",
            model: "ref",
        });

        expect(actionRepository.savedWith.length).toEqual(1);
    });

    it("should throw an error if the last action is already started", async () => {

        actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().build())];
        const sut = await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: 1244,
            action: "asm",
            model: "ref",
        });
        expect(sut.extract()).toEqual(new ActionAlreadyOpennedError(1));
    });
    it("should NOT throw an error if the last action is not started", async () => {
        dateService.nowDate = new Date(2022,6,6)

        actionRepository.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(1).withStatus(Status.ENDED).build()),
            ActionsMapper.toRepository(new ActionBuilder().withId(2).withStatus(Status.CANCELED).build()),
        ];
        const sut = await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: 1244,
            action: "asm",
            model: "ref",
        });

        expect(actionRepository.savedWith[0]).toEqual(new ActionBuilder().withId(3).withStart(dateService.now()).build())
    });
 
});



