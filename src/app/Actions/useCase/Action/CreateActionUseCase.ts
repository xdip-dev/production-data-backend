import { Either, Left, Right } from "purify-ts";
import { ActionAlreadyOpennedError } from "../../domain/errors/ActionAlreadyOpennedError";
import { Actions } from "../../domain/Actions";
import { ActionRepository } from "../../domain/port/ActionRepository";
import { UseCase } from "../../../shared/UseCase";
import { DateService } from "../../../shared/date/DateService";
import { IdGenerator } from "../../../shared/id-generator/IdGenerator";
import { Status } from "../../domain/StautsActions";

interface Props {
    operatorId: number;
    action: string;
    model: string;
    previousAction?:number;
}

export class CreateActionUseCase
    implements UseCase<Props, Promise<Either<ActionAlreadyOpennedError, string>>>
{
    constructor(
        private actionRepository: ActionRepository,
        private dateService: DateService,
        private idGenerator: IdGenerator
    ) {}

    public async execute(props: Props): Promise<Either<ActionAlreadyOpennedError, string>> {
        const lastIdRepository = await this.actionRepository.getLastActionId();
        let id:number
        if(!lastIdRepository){
            id = 1
        } else {
            id = lastIdRepository + 1
        }

        const actionCreated = Actions.create({
            actionId: id,
            operatorId: props.operatorId,
            model: props.model,
            action: props.action,
            dateService: this.dateService,
            previousAction:props.previousAction ? props.previousAction : null,
        });
        const actionExistingForOperator = await this.actionRepository.getLastActionByOperatorId(
            props.operatorId
        );

        if (actionExistingForOperator?.toState().status === Status.STARTED) {
            return Left(new ActionAlreadyOpennedError(actionExistingForOperator.toState().actionId));
        }

        await this.actionRepository.save(actionCreated);

        return Right(`Action created id :${actionCreated.toState().actionId.toString()}`);
    }
}
