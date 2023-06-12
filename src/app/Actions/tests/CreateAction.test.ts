import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { CreateActionUseCase } from "../useCase/CreateActionUseCase";
import { ActionAlreadyOpennedError } from "../domain/errors/ActionAlreadyOpennedError";
import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { IdGenerator } from "../../shared/id-generator/IdGenerator";
import { InMemoryIdGenerator } from "../../shared/id-generator/InMemoryIdGenerator";

let actionRepository:InMemoryActionsRepository
let dateService:InMemoryDateService
let idGenerator:InMemoryIdGenerator

describe("Production Management ASM", () => {
    beforeEach(() => {
        actionRepository=new InMemoryActionsRepository()
        dateService=new InMemoryDateService()
        idGenerator = new InMemoryIdGenerator()
    })
    it("should create an action into the repository with a start date", async () => {
        dateService.nowDate = new Date(2022,6,6)

        await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: "xxx",
            action: "asm",
            model: "ref",
        });


        expect(actionRepository.savedWith[0]).toEqual(new ActionBuilder().withStart(new Date(2022,6,6)).build())
        
    });
    it("should save only once the data on creation", async () => {
        await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: "xxx",
            action: "asm",
            model: "ref",
        });

        expect(actionRepository.savedWith.length).toEqual(1);
    });

    it("should throw an error if an action is already started", async () => {

        actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().build())];
        const sut = await new CreateActionUseCase(actionRepository,dateService,idGenerator).execute({
            operatorId: "xxx",
            action: "asm",
            model: "ref",
        });
        expect(sut.extract()).toEqual(new ActionAlreadyOpennedError(1));
    });
 
});



