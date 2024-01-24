export class AlreadyOpennedError extends Error {
    constructor(id: number) {
        super(`already existing with an id : ${id.toString()}`);
    }
}
