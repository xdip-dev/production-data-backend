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

    public async getOpenActionByOperatorId(operatorId: string): Promise<Actions | null> {
        const action = this.datas.find(
            (data) => data.operatorId === operatorId && data.status === Status.STARTED);
        if (!action) {
            return null;
        }
        return ActionsMapper.toDomain(action);
    }

    public async getById(id: number): Promise<Actions | null> {
        const action = this.datas.find((data) => data.__id === id);

        if (!action) {
            return null;
        }

        return ActionsMapper.toDomain(action);
    }
}
