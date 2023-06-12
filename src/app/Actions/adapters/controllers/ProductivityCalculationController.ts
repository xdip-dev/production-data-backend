import Zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { ProductivityCalculationSchema } from "../schema/ProductivityCalculationSchema";
import ProductivityCalculationUseCase from "../../useCase/ProductivityCalculationUseCase";
import { InMemoryActionsRepository } from "../repository/Actions/InMemoryActionsRepository";
import { ActionsMapper } from "../repository/Actions/ActionsMapper";
import { ActionBuilder } from "../../domain/ActionBuilder";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";

export class ProductivityCalculationController {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.post("/set-productivity", {
        schema: {
          body: ProductivityCalculationSchema,
          response: {
            200: Zod.undefined(),
            403: Zod.string(),
          },
        },
        handler: async (request, response) => {

          let inMemoryRepo = new InMemoryActionsRepository()
          inMemoryRepo.datas = [
            ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
        ];
          const res = await new ProductivityCalculationUseCase(dependencies.actionRepository).execute(request.body);

          if (res) {
            response.code(403).send(res.message)
          } else {
            response.send()
          }
        },
      });
    }
  }