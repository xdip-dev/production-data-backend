import { Actions } from "./Actions";
import { ActionNotFoundError } from "./errors/ActionNotFoundError";

export interface ActionRepository {
    save(props:Actions):Promise<void>,
    getOpenActionByOperatorId(operatorId:string):Promise<Actions | null>,
    getById(id:number):Promise<Actions | null>,
}