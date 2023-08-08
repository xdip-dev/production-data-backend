import { Server } from "../../../../infra/server/Server";
import { GenerateBarcodePdfUseCase } from "../../useCase/GenerateBarcodePdfUseCase";
import { PdfDependencies } from "../PdfDependenciesContainer";
import { GenerateBarcodePdfSchema } from "../schema/GenerateBarcodePdfSchema";


export class GenerateBarcodePdfController {
	constructor(private server: Server) {}

	public async execute(dependencies:PdfDependencies) {
		this.server.post("/generate-pdf-barcode", {
			schema: {
				body: GenerateBarcodePdfSchema,
			},
			handler: async (request, response) => {
				const res = await new GenerateBarcodePdfUseCase(dependencies.generateBarcodePdf).execute(request.body);
				response.type("application/pdf");
				response.header("Content-Disposition", "attachment; filename=barcode.pdf");
				response.send(Buffer.from(res));
			},
		});
	}
}
