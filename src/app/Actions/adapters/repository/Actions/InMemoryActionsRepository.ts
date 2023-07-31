import { ActionNotFoundError } from "../../../domain/errors/ActionNotFoundError";
import { Actions } from "../../../domain/Actions";
import { ActionRepository } from "../../../domain/ActionRepository";
import { Status } from "../../../domain/StautsActions";
import { ActionsMapper } from "./ActionsMapper";
import { ModelActionsRepository } from "./ModelActionsRepository";

export class InMemoryActionsRepository implements ActionRepository {
    public datas: ModelActionsRepository[] = [];
    public savedWith: Actions[] = [];
    
    public async save(props: Actions): Promise<void> {
        this.savedWith.push(props);
    }

    public async getLastActionId(): Promise<number | null> {
        let matchingAction = null
        let highestId = 0

        for (const data of this.datas) {
            if (data.actionId > highestId) {
                matchingAction = data
                highestId = data.actionId
            }
        }

        if (!matchingAction) {
            return null;
        }
        return highestId;
    }

    public async getLastActionByOperatorId(operatorId: string): Promise<Actions | null> {
        let matchingAction = null
        let highestId = 0

        for (const data of this.datas) {
            if (data.operatorId == operatorId && data.actionId > highestId) {
                matchingAction = data
                highestId = data.actionId
            }
        }

        if (!matchingAction) {
            return null;
        }
        return ActionsMapper.toDomain(matchingAction);
    }

    public async getById(id: number): Promise<Actions | null> {
        const action = this.datas.find((data) => data.actionId === id);

        if (!action) {
            return null;
        }

        return ActionsMapper.toDomain(action);
    }
}
