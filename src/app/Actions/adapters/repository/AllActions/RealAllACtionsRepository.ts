import { SqlRepositoryProduction } from "../../../../../infra/repository/SqlRepositoryProduction";
import { AllActions } from "../../../domain/AllActions";
import { AlreadyExistingError } from "../../../domain/errors/AlreadyExistingError";
import { AllActionsRepository } from "../../../domain/port/AllActionsRepository";
import { AllActionsMapper } from "./AllActionsMapper";
import { ModelAllActionRepository } from "./ModelAllActionRepository";

export class RealAllActionsRepository extends SqlRepositoryProduction<ModelAllActionRepository> implements AllActionsRepository{

    constructor() {
        super("all_actions");
        const columns : Array<keyof AllActions> = ['action','zone']
        this.instance.schema.hasTable(this.tableName).then((exist) => {
          if (!exist)
            return this.instance.schema.createTable(this.tableName, (table) => {
                table.increments();
                columns.forEach((column)=>{
                    table.string(column);
                })
            });
        });
      }

    public async addAction(props: AllActions): Promise<void | null> {
        const actionExisiting = await this.getTable<ModelAllActionRepository>().where({action:props.action}).first()

        if (actionExisiting) {
            return null
        }
        return this.getTable<ModelAllActionRepository>().insert(AllActionsMapper.toRepository(props))
    }

    public async getAllActions(): Promise<AllActions[]|null> {
        const actions = await this.instance.select().from<ModelAllActionRepository>(this.tableName)
        if (!actions) {
            return null
        }
        actions.map((action)=>{AllActionsMapper.toDomain(action)})
        return actions
    }
}