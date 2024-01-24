import { IdGenerator } from "./IdGenerator";

export class RealIdGenerator implements IdGenerator {
    //TODO : Redo with real one
    public async generateId(): Promise<number> {
        const id = Math.round(Math.random() * 100);
        return id;
    }
}
