import { Server } from "../../../../../infra/server/Server";
import { GetAllActionUseCase } from "../../../useCase/AllActions/GetAllActionsUseCase";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { AllActionsMapper } from "../../repository/AllActions/AllActionsMapper";

export class GetAllActionController {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
      this.server.get("/get-all-actions", {
        handler: async (request, response) => {

          const res = await new GetAllActionUseCase(dependencies.allActionRepository).execute();

          if (res instanceof Error) {
            throw res;
          }
          else{
            response.send(res)
          }
        },
      });
    }
  }