import { Injectable } from '@nestjs/common';
export type Machine = {
    id: number;
    name: string;
    barcode: string;
};

@Injectable()
export abstract class MachineRepository {
    abstract save(props: Machine): Promise<void>;
    abstract modifyName(props: { id: number; name: string }): Promise<void>;
    abstract delete(id: number): Promise<void>;
    abstract getAllMachines(): Promise<Machine[]>;
    abstract getLastId(): Promise<number>;
}
