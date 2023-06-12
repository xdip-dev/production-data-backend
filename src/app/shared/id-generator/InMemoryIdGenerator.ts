import { IdGenerator } from "./IdGenerator";

export class InMemoryIdGenerator implements IdGenerator{
    public async generateId(): Promise<number> {
        return 1
    }

}