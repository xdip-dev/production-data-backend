import { UseCase } from "../../../shared/UseCase";
import { ActionRepository } from "../../domain/port/ActionRepository";

interface Props {
    actionId: number;
}

export class SetBreakNumberUseCase implements UseCase<Props,void> {
    constructor(private actionRepository: ActionRepository) {}
    public async execute(props:Props) {
        const matchAction = await this.actionRepository.getById(props.actionId);
        if (!matchAction) {
            return null
        }

        matchAction.setBreakNumber();

        this.actionRepository.save(matchAction);
    }

}