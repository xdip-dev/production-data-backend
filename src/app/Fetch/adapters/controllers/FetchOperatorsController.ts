import { Server } from "../../../../infra/server/Server";
import { FetchModelUseCase } from "../../useCase/FetchModelUseCase";
import { FetchOperatorUseCase } from "../../useCase/FetchOperatorUseCase";
import { FetchDependencies, FetchDependenciesContainer } from "../FetchDependenciesContainer";

export class FetchOperatorsController {
  constructor(private server: Server) {}

  public async execute(dependencies: FetchDependencies) {
    this.server.get("/get-operators", {
      handler: async (request, response) => {
        const res = await new FetchOperatorUseCase(
          dependencies.erpRepository
        ).execute();
        response.send(res);
      },
    });
 
  }
}
