import { Injectable } from '@nestjs/common';
export type Action = {
    id: number;
    name: string;
    zone?: string | null;
};

@Injectable()
export abstract class ActionRepository {
    abstract save(props: { name: string; zone?: string }): Promise<void>;
    abstract modify(props: { id: number; name: string; zone?: string }): Promise<void>;
    abstract delete(id: number): Promise<void>;
    abstract getAllActions(): Promise<Action[]>;
}
