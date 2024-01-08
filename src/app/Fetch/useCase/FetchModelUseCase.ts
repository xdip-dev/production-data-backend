import { UseCase } from "../../shared/UseCase";
import { Model } from "../domain/Model";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { ErpRepository } from "../domain/ports/ErpRepository";

export class FetchModelUseCase
  implements UseCase<void, Promise<NoDataFound | Model[]>>
{
  constructor(private erpRepository: ErpRepository) {}

  public async execute(): Promise<NoDataFound | Model[]> {
    const listeModels = await this.erpRepository.getAllModels();

    if (!listeModels) {
      return new NoDataFound();
    }

    return listeModels;
  }
}
