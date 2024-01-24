export class AlreadyExistingError extends Error{
    constructor(){
        super('Data Already Exists')
    }
}