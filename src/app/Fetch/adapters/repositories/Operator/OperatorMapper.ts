import { Operator } from "../../../domain/Operator";
import { ModelOperatorRepository } from "./ModelOperatorRepository";

export class OperatorMapper {
    public static toDomain(props:ModelOperatorRepository):Operator {
        return {
            id:props.id,
            name:props.name_related,
            barcode:props.barcode,
        }
    }
}