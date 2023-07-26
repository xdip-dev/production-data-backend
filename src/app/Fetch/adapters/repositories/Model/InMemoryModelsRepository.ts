import { Model } from "../../../domain/Model";
import { ModelsRepository } from "../../../domain/ports/ModelRepository";

export class InMemoryModelsRepository implements ModelsRepository {

  public data: Model[] = [
    {name:'Model1'},
    {name:'Model2'},
    {name:'Model3'},
    {name:'Model4'},
    {name:'Model5'},
  ];

  public async getAllModels(): Promise<Model[]|null> {
    const action = this.data

    if (!action || action.length === 0) {
      return null;
    }

    return action;
  }
}
