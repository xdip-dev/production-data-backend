import zod from "zod";
import { Server } from "../../../../infra/server/Server";
import { ActionsDependencies } from "../ActionsDependenciesContainer";
import { GetLastActionSchema } from "../schema/GetLastActionSchema";
import { GetLastActionUseCase } from "../../useCase/GetLastActionUseCase";
import { type } from "os";
import { Actions } from "../../domain/Actions";

export class GetLastActionControllers {
    constructor(private server: Server) {}
  
    public async execute(dependencies: ActionsDependencies) {
        this.server.post("/get-last-action", {
            schema: {
              body: GetLastActionSchema,
              response: {
                200: zod.undefined(),
                403: zod.string(),
              },
            },
            handler: async (request, response) => {
    
            //   let inMemoryRepo = new InMemoryActionsRepository()
            //   inMemoryRepo.datas = [
            //     ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
            // ];
              
              const res = await new GetLastActionUseCase(dependencies.actionRepository).execute(request.body);
                if (res instanceof Actions) {
                  
                  response.send(JSON.stringify(res.toState()))
                }
                else{
                  response.code(403).send(res.message)
                }
            },
          });
}
}