import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';
import { setupTestEnvironment, teardownTestEnvironment } from '../fixtureContainerPrisma';
import { MachineModule } from '@/machine/machine.module';
import { PrismaMachineRepository } from '@/machine/infrastructure/adapters/repository/PrismaMachineRepository';
import { Machine } from '@/machine/domain/port/MachineRepository';

describe('Machine Module (e2e)', () => {
    let app: INestApplication;
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;
    let machineRepo: PrismaMachineRepository;

    beforeAll(async () => {
        const setup = await setupTestEnvironment();
        container = setup.container;
        prismaClient = setup.prismaClient;
    }, 50000);
    afterAll(async () => {
        await teardownTestEnvironment(container, prismaClient);
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [MachineModule],
        })
            .overrideProvider(PrismaClient)
            .useValue(prismaClient)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await prismaClient.machines.deleteMany();
        await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE public."Machines" RESTART IDENTITY`);
        machineRepo = new PrismaMachineRepository(prismaClient);
    });

    describe(" Machine Controller's", () => {
        describe('machine creation', () => {
            // const pathUrl = '/machine';
            it('should create the machine into the DB returning a 201', async () => {
                await request(app.getHttpServer())
                    .post('/machine/create')
                    .send({ name: 'Machine 1' })
                    .expect(201);

                const data = await machineRepo.getAllMachines();
                const expected: Machine[] = [
                    {
                        id: 'M-1',
                        name: 'Machine 1',
                        barcode: 'M-1',
                    },
                ];
                expect(data).toEqual(expected);
            });
            it('should create several machine with the right incrementations', async () => {
                await request(app.getHttpServer())
                    .post('/machine/create')
                    .send({ name: 'Machine 1' })
                    .expect(201);
                await request(app.getHttpServer())
                    .post('/machine/create')
                    .send({ name: 'Machine 2' })
                    .expect(201);
                await request(app.getHttpServer())
                    .post('/machine/create')
                    .send({ name: 'Machine 3' })
                    .expect(201);

                const data = await machineRepo.getAllMachines();
                const expected: Machine[] = [
                    {
                        id: 'M-1',
                        name: 'Machine 1',
                        barcode: 'M-1',
                    },
                    {
                        id: 'M-2',
                        name: 'Machine 2',
                        barcode: 'M-2',
                    },
                    {
                        id: 'M-3',
                        name: 'Machine 3',
                        barcode: 'M-3',
                    },
                ];
                expect(data).toEqual(expected);
            });
        });

        describe('machine modification', () => {
            it('should modify the machine name into the DB returning a 200', async () => {
                await machineRepo.save({ id: 'M-1', name: 'Machine 1', barcode: 'M-1' });
                await request(app.getHttpServer())
                    .patch('/machine/modify')
                    .send({ id: 'M-1', name: 'Machine 2' })
                    .expect(200);

                const data = await machineRepo.getAllMachines();
                const expected: Machine[] = [
                    {
                        id: 'M-1',
                        name: 'Machine 2',
                        barcode: 'M-1',
                    },
                ];
                expect(data).toEqual(expected);
            });
        });

        describe('machine deletion', () => {
            it('should delete the machine from the DB returning a 200', async () => {
                await machineRepo.save({ id: 'M-1', name: 'Machine 1', barcode: 'M-1' });
                await request(app.getHttpServer())
                    .delete('/machine/delete')
                    .send({ id: 'M-1' })
                    .expect(200);

                const data = await machineRepo.getAllMachines();
                const expected: Machine[] = [];
                expect(data).toEqual(expected);
            });
        });
    });
});
