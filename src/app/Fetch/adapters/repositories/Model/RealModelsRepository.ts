import { filtroRepository } from "../../../../../infra/repository/filtroRepository";
import { Model } from "../../../domain/Model";
import { ModelsRepository } from "../../../domain/ports/ModelRepository";

export class RealModelsRepository
  extends filtroRepository
  implements ModelsRepository
{
  private columns: Array<keyof Model> = [
    'name',
  ];
  public async getAllModels(): Promise<Model[] | null> {
    const action:Model[] = await this.instance
      .column(this.columns)
      .select()
      .from<Model>("public.prod_model")


    if (!action || action.length === 0) {
      return null;
    }

    return action;
  }
  
}
