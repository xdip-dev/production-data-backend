import { Matrice, MatriceRepository } from '@/matrice/domain/port/MatriceRepository';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaMatriceRepository implements MatriceRepository {
    constructor(private readonly prismaClient: PrismaClient) {}
    async save(props: Matrice): Promise<void> {
        try {
            await this.prismaClient.matrice.create({
                data: {
                    CODE_ID: props.code_id,
                    DESIGNATION: props.designation,
                    BARCODE: props.barcode,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Duplicate matrice id/barecode');
                }
            }
            throw error;
        }
    }
    async modifyDesignaiton(props: { code_id: string; designation: string }): Promise<void> {
        try {
            await this.prismaClient.matrice.update({
                where: { CODE_ID: props.code_id },
                data: { DESIGNATION: props.designation },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Matrice not found');
                }
            }
            throw error;
        }
    }
    async delete(code_id: string): Promise<void> {
        try {
            await this.prismaClient.matrice.delete({
                where: { CODE_ID: code_id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Matrice not found');
                }
            }
            throw error;
        }
    }
    async getAllMatrice(): Promise<Matrice[]> {
        const matrices = await this.prismaClient.matrice.findMany();
        return matrices.map((matrice) => ({
            code_id: matrice.CODE_ID,
            designation: matrice.DESIGNATION,
            barcode: matrice.BARCODE,
        }));
    }
}
