import zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { InMemoryActionsRepository } from "../repository/Actions/InMemoryActionsRepository";
import { EndActionUseCase } from "../../useCase/EndActionUseCase";
import { EndActionSchema } from "../schema/EndActionSchema";
import { ActionsMapper } from "../repository/Actions/ActionsMapper";
import { ActionBuilder } from "../../domain/ActionBuilder";

export class EndActionController {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.post("/end-action", {
        schema: {
          body: EndActionSchema,
          response: {
            200: zod.undefined(),
            403: zod.string(),
          },
        },
        handler: async (request, response) => {

          let inMemoryRepo = new InMemoryActionsRepository()
          inMemoryRepo.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
            ActionsMapper.toRepository(new ActionBuilder().withId(3).withEnd(new Date()).build()),
        ];
          const res= await new EndActionUseCase(dependencies.actionRepository,dependencies.dateService).execute(request.body);
  
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