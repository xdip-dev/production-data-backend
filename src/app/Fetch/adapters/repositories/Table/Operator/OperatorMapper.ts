import { Operator } from "../../../../domain/Operator";
import { PartialOperatorTable } from "./PartialOperatorTable";

export class OperatorMapper {
    public static toDomain(props:PartialOperatorTable):Operator {
        return {
            id:props.id,
            name:props.name_related,
            barcode:props.barcode,
        }
    }
}