import { Machine, MachineRepository } from '@/machine/domain/port/MachineRepository';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaMachineRepository implements MachineRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    async save(props: Machine): Promise<void> {
        try {
            await this.prismaClient.machines.create({
                data: {
                    ID: props.id,
                    NAME: props.name,
                    BARCODE: props.barcode,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Duplicate machine id/barecode');
                }
            }
            throw error;
        }
    }
    async modifyName(props: { id: number; name: string }): Promise<void> {
        try {
            await this.prismaClient.machines.update({
                where: { ID: props.id },
                data: { NAME: props.name },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Machine not found');
                }
            }
            throw error;
        }
    }
    async delete(id: number): Promise<void> {
        try {
            await this.prismaClient.machines.delete({
                where: { ID: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Machine not found');
                }
            }
            throw error;
        }
    }
    async getAllMachines(): Promise<Machine[]> {
        const machines = await this.prismaClient.machines.findMany();
        return machines.map((machine) => ({
            id: machine.ID,
            name: machine.NAME,
            barcode: machine.BARCODE,
        }));
    }
    async getLastId(): Promise<number> {
        const machines = await this.prismaClient.machines.findMany({
            orderBy: { ID: 'desc' },
            take: 1,
        });
        if (machines.length === 0) {
            return 0;
        }
        return machines[0].ID;
    }
}
