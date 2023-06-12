import Zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { CancelActionUseCase } from "../../useCase/CancelActionUseCase";
import { CancelActionSchema } from "../schema/CancelActionSchema";
import { InMemoryActionsRepository } from "../repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../repository/Actions/ActionsMapper";
import { ActionBuilder } from "../../domain/ActionBuilder";

export class CancelActionControllers {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.post("/cancel", {
        schema: {
          body: CancelActionSchema ,
          response: {
            200: Zod.undefined(),
            403: Zod.string(),
          },
        },
        handler: async (request, response) => {

        //   let inMemoryRepo = new InMemoryActionsRepository()
        //   inMemoryRepo.datas = [
        //     ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
        //     ActionsMapper.toRepository(new ActionBuilder().withId(3).withEnd(new Date()).build()),
        // ];
          const res = await new CancelActionUseCase(dependencies.actionRepository,dependencies.dateService).execute(request.body);

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