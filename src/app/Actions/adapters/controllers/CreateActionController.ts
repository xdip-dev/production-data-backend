import zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { CreateActionUseCase } from "../../useCase/CreateActionUseCase";
import { CreateActionSchema } from "../schema/CreateActionShema";
import { InMemoryActionsRepository } from "../repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../repository/Actions/ActionsMapper";
import { ActionBuilder } from "../../domain/ActionBuilder";
import { InMemoryIdGenerator } from "../../../shared/id-generator/InMemoryIdGenerator";
import { Status } from "../../domain/StautsActions";

export class CreateActionController {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.post("/create", {
        schema: {
          body: CreateActionSchema,
        },
        handler: async (request, response) => {

        //   let inMemoryRepo = new InMemoryActionsRepository()
        //   inMemoryRepo.datas = [
        //     ActionsMapper.toRepository(new ActionBuilder().withId(1).withOperatorId("xxx").withStatus(Status.ENDED).build()),
        //     ActionsMapper.toRepository(new ActionBuilder().withId(2).withOperatorId("xxx").withStatus(Status.STARTED).build()),
        //     ActionsMapper.toRepository(new ActionBuilder().withId(3).withOperatorId("yyy").withStatus(Status.STARTED).build()),
        // ];
          
          const res = await new CreateActionUseCase(dependencies.actionRepository,dependencies.dateService,dependencies.idGenerator).execute(request.body);
  
          res.caseOf({
            Left: (value) => {
              throw value
            },
            Right: (value) => {
              response.send(JSON.stringify(value))
            },
          })
        },
      });
    }
  }