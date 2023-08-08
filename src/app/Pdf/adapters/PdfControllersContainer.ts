import { Server } from "../../../infra/server/Server"
import { PdfDependenciesContainer } from "./PdfDependenciesContainer"
import { GenerateBarcodePdfController } from "./controllers/GenerateBarcodePdfControllers"


export class PdfControllerContainer {
    public static execute() {
        const dependencies = PdfDependenciesContainer.getInstance().dependencies
        const server = Server.getInstance()
        new GenerateBarcodePdfController(server).execute(dependencies)
    }
}