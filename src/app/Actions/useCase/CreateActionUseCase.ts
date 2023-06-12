import { Either, Left, Right } from "purify-ts";
import { ActionAlreadyOpennedError } from "../domain/errors/ActionAlreadyOpennedError";
import { Actions } from "../domain/Actions";
import { ActionRepository } from "../domain/ActionRepository";
import { UseCase } from "../../shared/UseCase";
import { DateService } from "../../shared/date/DateService";
import { IdGenerator } from "../../shared/id-generator/IdGenerator";

interface Props {
    operatorId: string;
    action: string;
    model: string;
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
        const actionCreated = Actions.create({
            __id: await this.idGenerator.generateId(),
            operatorId: props.operatorId,
            model: props.model,
            action: props.action,
            dateService: this.dateService,
        });
        const actionExistingForOperator = await this.actionRepository.getOpenActionByOperatorId(
            props.operatorId
        );
        if (actionExistingForOperator) {
            return Left(new ActionAlreadyOpennedError(actionExistingForOperator.toState().__id));
        }

        await this.actionRepository.save(actionCreated);

        return Right(actionCreated.toState().__id.toString());
    }
}
