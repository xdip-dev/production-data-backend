import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ErpRepository {
    abstract getAllModels(): Promise<{ id: number; name: string }[] | null>;
    abstract getAllOperators(): Promise<
        | {
              id: number;
              name: string;
              barecode: string;
          }[]
        | null
    >;
}
