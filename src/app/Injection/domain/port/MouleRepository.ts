import { Moule } from "../Moule";

export interface MouleRepository {
    getById(id:number):Promise<Moule | null>,
    getByCode(code:number):Promise<Moule | null>,
    save(props:Moule):Promise<void>,
}