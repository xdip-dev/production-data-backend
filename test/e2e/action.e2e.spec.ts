import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';
import { InMemoryDateService } from '@/step-production/infrastructure/adapters/date/InMemoryDateService';
import { setupTestEnvironment, teardownTestEnvironment } from '../fixtureContainerPrisma';
import { ActionModule } from '@/actions/actions.module';
import { Action } from '@/actions/domain/port/ActionsRepository';
import { PrismaActionRepository } from '@/actions/infrastructure/adapters/repository/PrismaActionRepository';

describe('Action Module (e2e)', () => {
    let app: INestApplication;
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;

    const now = new Date('2023-02-14T19:00:00.000Z');
    const dateProvider = new InMemoryDateService();
    dateProvider.nowDate = now;
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
            imports: [ActionModule],
        })
            .overrideProvider(PrismaClient)
            .useValue(prismaClient)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await prismaClient.listActions.deleteMany();
        await prismaClient.$executeRawUnsafe(
            `TRUNCATE TABLE public."ListActions" RESTART IDENTITY CASCADE`,
        );
    });

    describe(" Actions Controller's", () => {
        describe('action creation', () => {
            const pathUrl = '/actions/create';
            it('should create actions into the DB returning a 201 or 400 for duplicate', async () => {
                const actionRepo = new PrismaActionRepository(prismaClient);

                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ name: 'Action 1', zone: 'zone 1' })
                    .expect(201);
                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ name: 'Action 2' })
                    .expect(201);
                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ name: 'Action 1', zone: 'zone 1' })
                    .expect(400);
                const data = await actionRepo.getAllActions();
                const expectedData: Action[] = [
                    {
                        id: 1,
                        name: 'Action 1',
                        zone: 'zone 1',
                    },
                    {
                        id: 2,
                        name: 'Action 2',
                        zone: null,
                    },
                ];
                expect(data).toEqual(expectedData);
            });
        });
        describe('action modification', () => {
            const pathUrl = '/actions/modify';
            it('should modify an action with 201 or 404 not Found', async () => {
                const actionRepo = new PrismaActionRepository(prismaClient);

                await actionRepo.save({ name: 'Action 1', zone: 'zone 1' });

                await request(app.getHttpServer())
                    .patch(pathUrl)
                    .send({ id: 1, name: 'Action 2', zone: 'zone 2' })
                    .expect(200);
                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ id: 9, name: 'Action 2', zone: 'zone 2' })
                    .expect(404);

                const data = await actionRepo.getAllActions();
                const expectedData: Action[] = [
                    {
                        id: 1,
                        name: 'Action 2',
                        zone: 'zone 2',
                    },
                ];
                expect(data).toEqual(expectedData);
            });
        });
        describe('action deletion', () => {
            const pathUrl = '/actions/delete';
            it('should delete an action with 201 or 400 ', async () => {
                const actionRepo = new PrismaActionRepository(prismaClient);

                await actionRepo.save({ name: 'Action 1', zone: 'zone 1' });

                await request(app.getHttpServer()).delete(pathUrl).send({ id: 1 }).expect(200);
                await request(app.getHttpServer()).delete(pathUrl).send({ id: 9 }).expect(400);

                const data = await actionRepo.getAllActions();
                const expectedData: Action[] = [];
                expect(data).toEqual(expectedData);
            });
        });
    });
});
