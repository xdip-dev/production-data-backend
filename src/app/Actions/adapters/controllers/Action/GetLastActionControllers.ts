import { Server } from "../../../../../infra/server/Server";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { GetLastActionUseCase } from "../../../useCase/Action/GetLastActionUseCase";
import { Actions } from "../../../domain/Actions";
import { GetLastActionSchema } from "../../schema/Action/GetLastActionSchema";

export class GetLastActionControllers {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/get-last-action", {
			schema: {
				body: GetLastActionSchema,
			},
			handler: async (request, response) => {
				const res = await new GetLastActionUseCase(dependencies.actionRepository).execute(request.body);
				if (res instanceof Actions) {
					response.send(JSON.stringify(res.toState()));
				} else {
					throw res;
				}
			},
		});
	}
}
