import { Status } from "../../../domain/StautsActions";

export interface ModelActionsRepository {
    actionId:number,
    operatorId:number,
    action:string,
    model:string,
    bonne:number ,
    rebut:number,
    start:Date| null,
    end:Date | null,
    status:Status,
    timeSeconde:number|null,
    productivity: number | null,
    breakNumber:number,
    previousAction:number | null,
    actionProblem:string | null,

}