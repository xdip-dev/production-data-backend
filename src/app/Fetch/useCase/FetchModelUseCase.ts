import { UseCase } from "../../shared/UseCase";
import { Model } from "../domain/Model";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { ModelsRepository } from "../domain/ports/ModelRepository";

export class FetchModelUseCase
  implements UseCase<void, Promise<NoDataFound | Model[]>>
{
  constructor(private operatorsRepository: ModelsRepository) {}

  public async execute(): Promise<NoDataFound | Model[]> {
    const listeModels = await this.operatorsRepository.getAllModels();

    if (!listeModels) {
      return new NoDataFound();
    }

    return listeModels;
  }
}
