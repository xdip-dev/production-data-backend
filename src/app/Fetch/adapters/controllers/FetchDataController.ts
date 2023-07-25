import { Server } from "../../../../infra/server/Server";
import { FetchOperatorUseCase } from "../../useCase/FetchOperatorUseCase";
import { FetchDependencies, FetchDependenciesContainer } from "../FetchDependenciesContainer";

export class FetchDataController {
  constructor(private server: Server) {}

  public async execute(dependencies: FetchDependencies) {
    this.server.get("/get-operators", {
      handler: async (request, response) => {
        const res = await new FetchOperatorUseCase(
          dependencies.operatorsRepository
        ).execute();
        response.send(res);
      },
    });
  }
}
