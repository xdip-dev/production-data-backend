import { filtroRepository } from "../../../../infra/repository/filtroRepository";
import { Model } from "../../domain/Model";
import { Operator } from "../../domain/Operator";
import { ErpRepository } from "../../domain/ports/ErpRepository";
import { PartialModelTable } from "./Table/Model/PartialModelTable";
import { OperatorMapper } from "./Table/Operator/OperatorMapper";
import { PartialOperatorTable } from "./Table/Operator/PartialOperatorTable";

export class RealErpRepository extends filtroRepository implements ErpRepository {

	private columnsModel: Array<keyof PartialModelTable> = ["name"];
	public async getAllModels(): Promise<Model[] | null> {
		const action: Model[] = await this.instance.column(this.columnsModel).select().from<Model>("public.prod_model");

		if (!action || action.length === 0) {
			return null;
		}

		return action;
	}

	private columnsOperator: Array<keyof PartialOperatorTable> = ["id", "barcode", "name_related"];
	public async getAllOpertors(): Promise<Operator[] | null> {
		const action: PartialOperatorTable[] = await this.instance
			.column(this.columnsOperator)
			.select()
			.from<PartialOperatorTable>("public.hr_employee");

		if (!action || action.length === 0) {
			return null;
		}

		const transformed = action.map((obj) => {
			return OperatorMapper.toDomain(obj);
		});
		return transformed;
	}
}
