import { Err, Ok, Result } from '@/shared/result';
import { Action, ActionRepository } from './domain/port/ActionsRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionService {
    constructor(private readonly actionRepository: ActionRepository) {}

    async getAllActions(): Promise<Action[]> {
        return await this.actionRepository.getAllActions();
    }

    async create(props: { name: string; zone?: string }): Promise<Result<void, Error>> {
        try {
            await this.actionRepository.save({
                name: props.name,
                zone: props.zone,
            });
        } catch (error) {
            if (error instanceof Error) {
                return Err.of(error);
            }
            return Err.of(new Error('Error on save Action'));
        }

        return Ok.of(undefined);
    }

    async modify(props: { id: number; name: string; zone?: string }): Promise<Result<void, Error>> {
        try {
            await this.actionRepository.modify(props);
        } catch (error) {
            return Err.of(new Error('Error on update Action'));
        }

        return Ok.of(undefined);
    }

    async delete(id: number): Promise<Result<void, Error>> {
        try {
            await this.actionRepository.delete(id);
        } catch (error) {
            return Err.of(new Error('Error on delete Action'));
        }

        return Ok.of(undefined);
    }
}
