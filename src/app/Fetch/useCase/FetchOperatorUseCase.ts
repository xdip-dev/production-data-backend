import { Either, Left, Right } from "purify-ts";
import { UseCase } from "../../shared/UseCase";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { NoAnswerServer } from "../domain/errors/NoAnserServer";
import { Operator } from "../domain/Operator";
import { ErpRepository } from "../domain/ports/ErpRepository";

export class FetchOperatorUseCase
  implements UseCase<void, Promise<NoDataFound | Operator[]>>
{
  constructor(private erpRepository: ErpRepository) {}

  public async execute(): Promise<NoDataFound | Operator[]> {
    const listeOperator = await this.erpRepository.getAllOpertors();

    if (!listeOperator) {
      return new NoDataFound();
    }

    return listeOperator;
  }
}
