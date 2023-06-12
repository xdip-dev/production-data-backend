import { SqlRepository } from "../../../../../infra/repository/SqlRepository";
import { ActionRepository } from "../../../domain/ActionRepository";
import { Actions } from "../../../domain/Actions";
import { Status } from "../../../domain/StautsActions";
import { ActionsMapper } from "./ActionsMapper";
import { ModelActionsRepository } from "./ModelActionsRepository";


export class RealActionsRepository extends SqlRepository<ModelActionsRepository> implements ActionRepository{

    constructor() {
        super("actions");
        this.instance.schema.hasTable(this.tableName).then((exist) => {
          if (!exist)
            return this.instance.schema.createTable(this.tableName, (table) => {
                table.increments();
                table.integer('__id').unique();
                table.string('operatorId');
                table.string('model');
                table.string('action');
                table.integer('bonne');
                table.integer('rebut');
                table.date('start').nullable();
                table.date('end').nullable();
                table.string('status');
                table.integer('timeSeconde').nullable();
                table.integer('productivity').nullable();
            });
        });
      }

    public async save(props: Actions): Promise<void> {
        const matchAction = await this.getTable<ModelActionsRepository>().where({__id:props.toState().__id}).first()

        if (matchAction) {
            return await this.getTable<ModelActionsRepository>()
                .where({__id:props.toState().__id})
                .update(ActionsMapper.toRepository(props))
        }
        return this.getTable<ModelActionsRepository>().insert(ActionsMapper.toRepository(props))
    }
    public async getOpenActionByOperatorId(operatorId: string): Promise<Actions | null> {
        const matchAction = await this.getTable<ModelActionsRepository>().where({operatorId:operatorId,status:Status.STARTED}).first()
        if (!matchAction) {
            return null
        }
        return ActionsMapper.toDomain(matchAction)
    }
    public async getById(__id: number): Promise<Actions | null> {
        const matchAction = await this.getTable<ModelActionsRepository>().where({__id:__id}).first()
        if (!matchAction) {
            return null
        }
        return ActionsMapper.toDomain(matchAction)
    }

}