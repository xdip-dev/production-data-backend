import { filtroRepository } from "../../../../../infra/repository/filtroRepository";
import { Operator } from "../../../domain/Operator";
import { OperatorsRepository } from "../../../domain/ports/OperatorsRepository";
import { ModelOperatorRepository } from "./ModelOperatorRepository";
import { OperatorMapper } from "./OperatorMapper";

export class RealOperatorsRepository
  extends filtroRepository
  implements OperatorsRepository
{
  private columns: Array<keyof ModelOperatorRepository> = [
    "id",
    "barcode",
    "name_related",
  ];
  public async getAllOpertors(): Promise<Operator[] | null> {
    const action:ModelOperatorRepository[] = await this.instance
      .column(this.columns)
      .select()
      .from<ModelOperatorRepository>("public.hr_employee")


    if (!action || action.length === 0) {
      return null;
    }

    const transformed = action.map((obj) => {
      return OperatorMapper.toDomain(obj);
    });
    return transformed;
  }
}
