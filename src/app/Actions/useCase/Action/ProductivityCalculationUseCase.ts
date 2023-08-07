import { UseCase } from "../../../shared/UseCase";
import { ActionRepository } from "../../domain/port/ActionRepository";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";
import { Either, Left, Right } from "purify-ts";

interface Props {
    actionId: number;
}

export default class ProductivityCalculationUseCase implements UseCase<Props, Promise<ActionNotFoundError | void>> {
    constructor(private actionRepository: ActionRepository) {}

    public async execute(props: Props): Promise<ActionNotFoundError | void> {
        const matchAction = await this.actionRepository.getById(props.actionId);
        if (!matchAction) {
            return new ActionNotFoundError()
        }

        matchAction.setProductivity();
        await this.actionRepository.save(matchAction)
        
    }
}
