import { Either, Left, Right } from "purify-ts";
import { UseCase } from "../../shared/UseCase";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { NoAnswerServer } from "../domain/errors/NoAnserServer";
import { Operator } from "../domain/Operator";
import { OperatorsRepository } from "../domain/ports/OperatorsRepository";

export class FetchOperatorUseCase
  implements UseCase<void, Promise<NoDataFound | Operator[]>>
{
  constructor(private operatorsRepository: OperatorsRepository) {}

  public async execute(): Promise<NoDataFound | Operator[]> {
    const listeOperator = await this.operatorsRepository.getAllOpertors();

    if (!listeOperator) {
      return new NoDataFound();
    }

    return listeOperator;
  }
}
