import { Server } from "../../../../infra/server/Server";
import { FetchModelUseCase } from "../../useCase/FetchModelUseCase";
import { FetchDependencies } from "../FetchDependenciesContainer";

export class FetchModelsController {
  constructor(private server: Server) {}

  public async execute(dependencies: FetchDependencies) {
    this.server.get("/get-models", {
      handler: async (request, response) => {
        const res = await new FetchModelUseCase(
          dependencies.erpRepository
        ).execute();
        response.send(res);
      },
    });
 
  }
}
