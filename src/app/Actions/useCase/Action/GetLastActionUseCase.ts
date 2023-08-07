import { UseCase } from "../../../shared/UseCase";
import { ActionRepository } from "../../domain/port/ActionRepository";
import { Actions } from "../../domain/Actions";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";

interface Props {
    operatorId:number
}

export class GetLastActionUseCase implements UseCase<Props,Promise<Actions | ActionNotFoundError>> {

    constructor(public actionRepository:ActionRepository) {}

    public async execute(props: Props): Promise<Actions | ActionNotFoundError> {
        const lastActionOperator=await this.actionRepository.getLastActionByOperatorId(props.operatorId)

        if(!lastActionOperator){
            return new ActionNotFoundError()
        }

        return lastActionOperator

    }

}