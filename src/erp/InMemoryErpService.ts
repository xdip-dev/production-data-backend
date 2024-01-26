import { Injectable } from '@nestjs/common';
import { ErpRepository } from './domain/port/ErpRepository';

@Injectable()
export class InMemoryErpService implements ErpRepository {
    getAllModels(): Promise<{ id: number; name: string }[] | null> {
        return Promise.resolve([
            {
                id: 1,
                name: 'Model 1',
            },
            {
                id: 2,
                name: 'Model 2',
            },
            {
                id: 3,
                name: 'Model 3',
            },
            {
                id: 4,
                name: 'Model 4',
            },
        ]);
    }
    getAllOperators(): Promise<{ id: string; name: string; barcode: string }[] | null> {
        return Promise.resolve([
            {
                id: '1',
                name: 'Operator 1',
                barcode: '11111',
            },
            {
                id: '2',
                name: 'Operator 2',
                barcode: '22222',
            },
            {
                id: '3',
                name: 'Operator 3',
                barcode: '33333',
            },
            {
                id: '4',
                name: 'Operator 4',
                barcode: '44444',
            },
        ]);
    }
}
