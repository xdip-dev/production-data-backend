import zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { CreateActionUseCase } from "../../useCase/CreateActionUseCase";
import { CreateActionSchema } from "../schema/CreateActionShema";
import { InMemoryActionsRepository } from "../repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../repository/Actions/ActionsMapper";
import { ActionBuilder } from "../../domain/ActionBuilder";
import { InMemoryIdGenerator } from "../../../shared/id-generator/InMemoryIdGenerator";

export class CreateActionController {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.post("/create", {
        schema: {
          body: CreateActionSchema,
          response: {
            200: zod.undefined(),
            403: zod.string(),
          },
        },
        handler: async (request, response) => {

          let inMemoryRepo = new InMemoryActionsRepository()
          inMemoryRepo.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
        ];

          
          const res = await new CreateActionUseCase(dependencies.actionRepository,dependencies.dateService,dependencies.idGenerator).execute(request.body);
  
          res.caseOf({
            Left: (value) => {
              response.code(403).send(value.message)
            },
            Right: (value) => {
              response.send(value)
            },
          })
        },
      });
    }
  }