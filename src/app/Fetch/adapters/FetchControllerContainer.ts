import { Server } from "../../../infra/server/Server"
import { FetchDependenciesContainer } from "./FetchDependenciesContainer"
import { FetchDataController } from "./controllers/FetchDataController"

export class FetchControllerContainer {
    public static execute() {
        const dependencies = FetchDependenciesContainer.getInstance().dependencies
        const server = Server.getInstance()
        new FetchDataController(server).execute(dependencies)


    }
}