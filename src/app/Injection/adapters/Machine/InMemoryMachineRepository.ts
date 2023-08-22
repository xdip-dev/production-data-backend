import { Machine } from "../../domain/Machine";
import { MachineRepository } from "../../domain/port/MachineRepository";

export class InMemoryMachineRepository implements MachineRepository{
    public data:Machine[]=[]
    
    public async getAllMachine(): Promise<Machine[]> {
        return this.data;
    }
    public async save(props: Machine): Promise<void> {
        this.data.push(props);
    }
}