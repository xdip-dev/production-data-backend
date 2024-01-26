import { Injectable } from '@nestjs/common';
export type Machine = {
    id: string;
    name: string;
    barcode: string;
};

@Injectable()
export abstract class MachineRepository {
    abstract save(props: Machine): Promise<void>;
    abstract modifyName(props: { id: string; name: string }): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract getAllMachines(): Promise<Machine[]>;
    abstract getLastId(): Promise<string | null>;
}
