import { Injectable } from '@nestjs/common';
export type Matrice = {
    code_id: string;
    designation: string;
    barcode: string;
};

@Injectable()
export abstract class MatriceRepository {
    abstract save(props: Matrice): Promise<void>;
    abstract modifyDesignaiton(props: { code_id: string; designation: string }): Promise<void>;
    abstract delete(code_id: string): Promise<void>;
    abstract getAllMatrice(): Promise<Matrice[]>;
}
