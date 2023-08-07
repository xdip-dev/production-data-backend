import { Server } from "../../../../../infra/server/Server";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { CancelActionUseCase } from "../../../useCase/Action/CancelActionUseCase";
import { CancelActionSchema } from "../../schema/Action/CancelActionSchema";

export class CancelActionControllers {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/cancel", {
			schema: {
				body: CancelActionSchema,
			},
			handler: async (request, response) => {
				const res = await new CancelActionUseCase(
					dependencies.actionRepository,
					dependencies.dateService
				).execute(request.body);
				res.caseOf({
					Left: (value) => {
						throw value;
					},
					Right: (value) => {
						response.send(JSON.stringify(value));
					},
				});
			},
		});
	}
}
