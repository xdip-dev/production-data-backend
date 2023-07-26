import { Server } from "../../../infra/server/Server"
import { FetchDependenciesContainer } from "./FetchDependenciesContainer"
import { FetchModelsController } from "./controllers/FetchModelsControllers"
import { FetchOperatorsController } from "./controllers/FetchOperatorsController"

export class FetchControllerContainer {
    public static execute() {
        const dependencies = FetchDependenciesContainer.getInstance().dependencies
        const server = Server.getInstance()
        new FetchOperatorsController(server).execute(dependencies)
        new FetchModelsController(server).execute(dependencies)


    }
}