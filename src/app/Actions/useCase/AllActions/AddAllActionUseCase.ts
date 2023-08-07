import { UseCase } from "../../../shared/UseCase";
import { AllActions } from "../../domain/AllActions";
import { AlreadyExistingError } from "../../domain/errors/AlreadyExistingError";
import { AllActionsRepository } from "../../domain/port/AllActionsRepository";

export class AddAllActionUseCase implements UseCase<AllActions, Promise<void | AlreadyExistingError>> {
	constructor(private allActionRepository: AllActionsRepository) {}

	public async execute(props: AllActions): Promise<void | AlreadyExistingError> {
		const actionExisiting = await this.allActionRepository.addAction(props);

		if (actionExisiting === null) {
			return new AlreadyExistingError();
		}
	}
}
