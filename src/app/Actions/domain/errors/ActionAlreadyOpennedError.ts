export class ActionAlreadyOpennedError extends Error {
    constructor(id:number){
        super(`already an action in openned with an id : ${id.toString()}`)
    }
}