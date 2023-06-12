export class ActionAlreadyClosedError extends Error {
    constructor(id:number){
        super(`Action already closed id : ${id.toString()} `)
    }
}