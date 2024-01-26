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
        const numberLastIdRepository = lastIdRepository?.split('-')[1];
        const id = numberLastIdRepository ? numberLastIdRepository + 1 : 1;
        const stringIdFormat = `M-${id}`;
        try {
            await this.machineRepo.save({
                id: stringIdFormat,
                name,
                barcode: stringIdFormat,
            });
        } catch (error) {
            return Err.of(new Error('Error on save machine'));
        }

        return Ok.of(undefined);
    }

    async modify(props: { id: string; name: string }): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.modifyName(props);
        } catch (error) {
            return Err.of(new Error('Error on update machine'));
        }

        return Ok.of(undefined);
    }

    async delete(id: string): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.delete(id);
        } catch (error) {
            return Err.of(new Error('Error on delete machine'));
        }

        return Ok.of(undefined);
    }
}
