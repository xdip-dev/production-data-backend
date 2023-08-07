import { NoDataFound } from "../../../Fetch/domain/errors/NoDataFound";
import { UseCase } from "../../../shared/UseCase";
import { AllActions } from "../../domain/AllActions";
import { AllActionsRepository } from "../../domain/port/AllActionsRepository";


export class GetAllActionUseCase implements UseCase<void, Promise<string[] | NoDataFound>> {
    constructor(private allActionRepository: AllActionsRepository){}
    public async execute(): Promise<NoDataFound | string[]> {

        const actions = await this.allActionRepository.getAllActions()
        
        if (!actions) {
            return new NoDataFound()
        }

        const actionsFormatted = actions.map((action: AllActions) => {
            return action.zone + '-' + action.action
        })

        return actionsFormatted
    }


}
