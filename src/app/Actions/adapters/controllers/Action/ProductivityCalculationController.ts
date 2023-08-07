import { Server } from "../../../../../infra/server/Server";
import { ActionsDependencies } from "../../ActionsDependenciesContainer";
import ProductivityCalculationUseCase from "../../../useCase/Action/ProductivityCalculationUseCase";
import { ProductivityCalculationSchema } from "../../schema/Action/ProductivityCalculationSchema";

export class ProductivityCalculationController {
	constructor(private server: Server) {}

	public async execute(dependencies: ActionsDependencies) {
		this.server.post("/set-productivity", {
			schema: {
				body: ProductivityCalculationSchema,
			},
			handler: async (request, response) => {
				const res = await new ProductivityCalculationUseCase(dependencies.actionRepository).execute(
					request.body
				);
				if (res) {
					throw res;
				} else {
					response.send();
				}
			},
		});
	}
}
