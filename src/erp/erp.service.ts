import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { ErpRepository } from './domain/port/ErpRepository';

@Injectable()
export class ErpService implements OnModuleInit, OnModuleDestroy, ErpRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

    async getAllModels(): Promise<{ id: number; name: string }[] | null> {
        try {
            const client = await this.pool.connect();
            try {
                const res = await client.query('SELECT id, name FROM public.prod_model');
                return res.rows;
            } finally {
                client.release();
            }
        } catch (error) {
            // Handle error (e.g., pool is shut down)
            console.error('Database query failed', error);
            throw error;
        }
    }

    async getAllOperators(): Promise<{ id: string; name: string; barcode: string }[] | null> {
        try {
            const client = await this.pool.connect();
            try {
                const res = await client.query(
                    'SELECT id, name_related as name, barcode FROM public.hr_employee',
                );
                return res.rows.map((row: { id: string; name: string; barcode: string }) => {
                    return {
                        id: row.id.toString(),
                        name: row.name,
                        barcode: row.barcode,
                    };
                });
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Database query failed', error);
            throw error;
        }
    }

    async onModuleInit() {
        await this.pool.connect();
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
