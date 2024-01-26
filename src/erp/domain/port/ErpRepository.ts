import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ErpRepository {
    abstract getAllModels(): Promise<{ id: number; name: string }[] | null>;
    abstract getAllOperators(): Promise<
        | {
              id: string;
              name: string;
              barcode: string;
          }[]
        | null
    >;
}
