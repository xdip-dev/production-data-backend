import { Action, ActionRepository } from '@/actions/domain/port/ActionsRepository';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaActionRepository implements ActionRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    async getAllActions(): Promise<Action[]> {
        const actions = await this.prismaClient.listActions.findMany();
        return actions.map((action) => ({
            id: action.ID,
            name: action.NAME,
            zone: action.ZONE,
        }));
    }

    async save(props: { name: string; zone?: string | undefined }): Promise<void> {
        try {
            await this.prismaClient.listActions.create({
                data: {
                    NAME: props.name,
                    ZONE: props.zone,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Duplicate action');
                }
            }
            throw error;
        }
    }
    async modify(props: { id: number; name: string; zone?: string }): Promise<void> {
        try {
            await this.prismaClient.listActions.update({
                where: { ID: props.id },
                data: { NAME: props.name, ZONE: props.zone },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Action not found');
                }
            }
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prismaClient.listActions.delete({
                where: { ID: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Action not found');
                }
            }
            throw error;
        }
    }
}
