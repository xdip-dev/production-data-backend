export class ActionNotFoundError extends Error{
    constructor(){
        super('Action not Found')
    }
}