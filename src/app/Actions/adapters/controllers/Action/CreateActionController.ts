import { Server } from "../../../../../infra/server/Server";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import { CreateActionUseCase } from "../../../useCase/Action/CreateActionUseCase";
import { CreateActionSchema } from "../../schema/Action/CreateActionShema";

export class CreateActionController {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/create", {
			schema: {
				body: CreateActionSchema,
			},
			handler: async (request, response) => {
				const res = await new CreateActionUseCase(
					dependencies.actionRepository,
					dependencies.dateService,
					dependencies.idGenerator
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
