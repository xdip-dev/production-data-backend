export class NoAnswerServer extends Error {
    constructor(){
        super(`server not answering`)
    }
}