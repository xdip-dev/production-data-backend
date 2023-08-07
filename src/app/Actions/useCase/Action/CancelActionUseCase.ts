import { UseCase } from "../../../shared/UseCase";
import { ActionRepository } from "../../domain/port/ActionRepository";
import { DateService } from "../../../shared/date/DateService";
import { Status } from "../../domain/StautsActions";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";
import { Either, Left } from "purify-ts";
import { ActionAlreadyClosedError } from "../../domain/errors/ActionAlreadyClosedError";

interface Props {
    actionId:number,
}

export class CancelActionUseCase implements UseCase<Props, Promise<Either<ActionNotFoundError | ActionAlreadyClosedError, Status>>> {
    constructor(
        private actionRepository: ActionRepository,
        private dateService:DateService) {}

    public async execute(props:Props): Promise<Either<ActionNotFoundError | ActionAlreadyClosedError, Status>> {
        const matchAction =await this.actionRepository.getById(props.actionId)
        if (!matchAction) {
            return Left(new ActionNotFoundError())
        }
        const CancelActionResponse = matchAction.cancelAction(this.dateService)
        if (CancelActionResponse.isRight()) {
            
            await this.actionRepository.save(matchAction)
        }

        return CancelActionResponse;
    }
}
