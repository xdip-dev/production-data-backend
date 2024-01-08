import { Model } from "../../domain/Model";
import { Operator } from "../../domain/Operator";
import { ErpRepository } from "../../domain/ports/ErpRepository";
import { OperatorMapper } from "./Table/Operator/OperatorMapper";
import { PartialOperatorTable } from "./Table/Operator/PartialOperatorTable";

export class InMemoryErpRepository implements ErpRepository {
	public dataModels: Model[] = [
		{ name: "Model1" },
		{ name: "Model2" },
		{ name: "Model3" },
		{ name: "Model4" },
		{ name: "Model5" },
	];
	public dataOperators: PartialOperatorTable[] = [
        { id: 1, name_related: "Roger", barcode: "0002" },
        { id: 98, name_related: "RogerFrere", barcode: "0152" },
        { id: 169, name_related: "RogerSoeur", barcode: "1698" },
        { id: 2, name_related: "RogerPere", barcode: "3654" },
    ];

	public async getAllModels(): Promise<Model[] | null> {
		const action = this.dataModels;

		if (!action || action.length === 0) {
			return null;
		}

		return action;
	}
    public async getAllOpertors(): Promise<Operator[] | null> {
        const action = this.dataOperators
    
        if (!action || action.length === 0) {
          return null;
        }
    
        const transformed = action.map((obj) => {
          return OperatorMapper.toDomain(obj);
        });
        return transformed;
      }
    
}
