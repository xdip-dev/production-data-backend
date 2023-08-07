import { NoDataFound } from "../../../Fetch/domain/errors/NoDataFound";
import { AllActions } from "../AllActions";
import { AlreadyExistingError } from "../errors/AlreadyExistingError";

export interface AllActionsRepository {
    getAllActions(): Promise<AllActions[]|null>;
    addAction(props:AllActions): Promise<void | null>;
}