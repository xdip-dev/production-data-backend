import { PropertySignature } from "typescript";
import { UseCase } from "../../../shared/UseCase";
import { ActionRepository } from "../../domain/port/ActionRepository";
import { DateService } from "../../../shared/date/DateService";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";
import { Either, Left, Right } from "purify-ts";
import { Status } from "../../domain/StautsActions";
import { ActionAlreadyClosedError } from "../../domain/errors/ActionAlreadyClosedError";

interface Props {
    actionId:number,
    bonne?:number,
    rebut?:number,
    actionProblem?:string,
}

export class EndActionUseCase implements UseCase<Props, Promise<Either<ActionNotFoundError | ActionAlreadyClosedError,Status>>> {
    constructor(
        private actionRepository: ActionRepository,
        private dateService:DateService) {}

    public async execute(props:Props): Promise<Either<ActionNotFoundError | ActionAlreadyClosedError,Status>> {
        const matchAction =await this.actionRepository.getById(props.actionId)
        if (!matchAction){
            return Left(new ActionNotFoundError())
        }
        const endOfActionResponse = matchAction.setEndOfAction(this.dateService,props.bonne,props.rebut,props.actionProblem)
        if (endOfActionResponse.isRight()) {
            await this.actionRepository.save(matchAction)
        }
        
        return endOfActionResponse
    }
}
