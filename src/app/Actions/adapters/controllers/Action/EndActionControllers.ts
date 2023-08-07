import { Server } from "../../../../../infra/server/Server";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { EndActionUseCase } from "../../../useCase/Action/EndActionUseCase";
import { EndActionSchema } from "../../schema/Action/EndActionSchema";

export class EndActionController {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/end-action", {
			schema: {
				body: EndActionSchema,
			},
			handler: async (request, response) => {
				const res = await new EndActionUseCase(dependencies.actionRepository, dependencies.dateService).execute(
					request.body
				);
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
