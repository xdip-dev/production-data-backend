import { Server } from "../../../../../infra/server/Server";
import { AddAllActionUseCase } from "../../../useCase/AllActions/AddAllActionUseCase";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { AddAllActionsSchema } from "../../schema/AllActions/AddAllActionsSchema";

export class AddAllActionController {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/add-all-actions", {
			schema: {
				body: AddAllActionsSchema,
			},
			handler: async (request, response) => {
				const res = await new AddAllActionUseCase(dependencies.allActionRepository).execute(request.body);
                if (res instanceof Error){
                    throw res
                }
			},
		});
	}
}
