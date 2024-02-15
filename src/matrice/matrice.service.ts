import { Err, Ok, Result } from '@/shared/result';
import { Injectable } from '@nestjs/common';
import { Matrice, MatriceRepository } from './domain/port/MatriceRepository';
import { MatriceDto } from './validations/MatriceValidations';

@Injectable()
export class MatriceService {
    constructor(private readonly machineRepo: MatriceRepository) {}

    async getAllMatrice(): Promise<Matrice[]> {
        return await this.machineRepo.getAllMatrice();
    }

    async create(props: MatriceDto): Promise<Result<void, Error>> {
        const barcode = props.code_id;
        try {
            await this.machineRepo.save({
                code_id: props.code_id,
                designation: props.designation,
                barcode: barcode,
            });
        } catch (error) {
            return Err.of(new Error('Error on save matrice'));
        }

        return Ok.of(undefined);
    }
    async modify(props: MatriceDto): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.modifyDesignaiton(props);
        } catch (error) {
            return Err.of(new Error('Error on update matrice'));
        }

        return Ok.of(undefined);
    }
    async delete(code_id: string): Promise<Result<void, Error>> {
        try {
            await this.machineRepo.delete(code_id);
        } catch (error) {
            return Err.of(new Error('Error on delete matrice'));
        }

        return Ok.of(undefined);
    }
}
