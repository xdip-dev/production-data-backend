export class AlreadyClosedError extends Error {
    constructor(id: number) {
        super(`Already closed with id : ${id.toString()} `);
    }
}
