import { UseCase } from "../../shared/UseCase";
import { ActionRepository } from "../domain/ActionRepository";
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError";
import { Either, Left, Right } from "purify-ts";

interface Props {
    __id: number;
}

export default class ProductivityCalculationUseCase implements UseCase<Props, Promise<ActionNotFoundError | void>> {
    constructor(private actionRepository: ActionRepository) {}

    public async execute(props: Props): Promise<ActionNotFoundError | void> {
        const matchAction = await this.actionRepository.getById(props.__id);
        if (!matchAction) {
            return new ActionNotFoundError()
        }

        matchAction.setProductivity();
        await this.actionRepository.save(matchAction)
        
    }
}
