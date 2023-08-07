import { Server } from "../../../infra/server/Server"
import { ActionsDependenciesContainer } from "./ActionsDependenciesContainer"
import { CancelActionControllers } from "./controllers/Action/CancelActionControllers"
import { CreateActionController } from "./controllers/Action/CreateActionController"
import { EndActionController } from "./controllers/Action/EndActionControllers"
import { GetLastActionControllers } from "./controllers/Action/GetLastActionControllers"
import { ProductivityCalculationController } from "./controllers/Action/ProductivityCalculationController"
import { AddAllActionController } from "./controllers/AllActions/AddAllActionsControllers"
import { GetAllActionController } from "./controllers/AllActions/GetAllActionsController"

export class ActionsControllerContainer {
    public static execute() {
        const dependencies = ActionsDependenciesContainer.getInstance().dependencies
        const server = Server.getInstance()
        new CreateActionController(server).execute(dependencies)
        new EndActionController(server).execute(dependencies)
        new CancelActionControllers(server).execute(dependencies)
        new ProductivityCalculationController(server).execute(dependencies)
        new GetLastActionControllers(server).execute(dependencies)
        new GetAllActionController(server).execute(dependencies)
        new AddAllActionController(server).execute(dependencies)


    }
}