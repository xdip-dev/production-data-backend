import { Machine, MachineRepository } from '@/machine/domain/port/MachineRepository';
import { Err, Ok, Result } from '@/shared/result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MachineService {
    constructor(private readonly machineRepo: MachineRepository) {}

    async getAllMachine(): Promise<Machine[]> {
        return await this.machineRepo.getAllMachines();
    }

    async create(name: string): Promise<Result<void, Error>> {
        const lastIdRepository = await this.machineRepo.getLastId();
        const id = lastIdRepository ? lastIdRepository + 1 : 1;
        const barcode = `OPM-${id}`;
        try {
            await this.machineRepo.save({
                id,
                name,
                barcode,
            });
        } catch (error) {
            return Err.of(new Error('Error on save machine'));
        }

        return Ok.of(undefined);
    }

    async modify(props: { id: number; name: string }): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.modifyName(props);
        } catch (error) {
            return Err.of(new Error('Error on update machine'));
        }

        return Ok.of(undefined);
    }

    async delete(id: number): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.delete(id);
        } catch (error) {
            return Err.of(new Error('Error on delete machine'));
        }

        return Ok.of(undefined);
    }
}
