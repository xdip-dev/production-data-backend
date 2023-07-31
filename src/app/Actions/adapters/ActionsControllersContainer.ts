import { Server } from "../../../infra/server/Server"
import { ActionsDependenciesContainer } from "./ActionsDependenciesContainer"
import { CancelActionControllers } from "./controllers/CancelActionControllers"
import { CreateActionController } from "./controllers/CreateActionController"
import { EndActionController } from "./controllers/EndActionControllers"
import { GetLastActionControllers } from "./controllers/GetLastActionControllers"
import { ProductivityCalculationController } from "./controllers/ProductivityCalculationController"

export class ActionsControllerContainer {
    public static execute() {
        const dependencies = ActionsDependenciesContainer.getInstance().dependencies
        const server = Server.getInstance()
        new CreateActionController(server).execute(dependencies)
        new EndActionController(server).execute(dependencies)
        new CancelActionControllers(server).execute(dependencies)
        new ProductivityCalculationController(server).execute(dependencies)
        new GetLastActionControllers(server).execute(dependencies)


    }
}