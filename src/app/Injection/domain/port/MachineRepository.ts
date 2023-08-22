import { Machine } from "../Machine";

export interface MachineRepository {
    getAllMachine():Promise<Machine[]>,
    save(props:Machine):Promise<void>,
}