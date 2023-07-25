import { Operator } from "../../../domain/Operator";
import { OperatorsRepository } from "../../../domain/ports/OperatorsRepository";
import { ModelOperatorRepository } from "./ModelOperatorRepository";
import { OperatorMapper } from "./OperatorMapper";

export class InMemoryOperatorsRepository implements OperatorsRepository {
  public data: ModelOperatorRepository[] = [
    { id: 1, name_related: "Roger", barcode: "0002" },
    { id: 98, name_related: "RogerFrere", barcode: "0152" },
    { id: 169, name_related: "RogerSoeur", barcode: "1698" },
    { id: 2, name_related: "RogerPere", barcode: "3654" },
  ];

  public async getAllOpertors(): Promise<Operator[] | null> {
    const action = this.data

    if (!action || action.length === 0) {
      return null;
    }

    const transformed = action.map((obj) => {
      return OperatorMapper.toDomain(obj);
    });
    return transformed;
  }
}
