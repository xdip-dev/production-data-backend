import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StepProductionModule } from '@/step-production/step-production.module';
import { StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';
import { DateService } from '@/step-production/domain/port/DateService';
import { InMemoryDateService } from '@/step-production/infrastructure/adapters/date/InMemoryDateService';
import { PrismaProductionRepository } from '@/step-production/infrastructure/adapters/repositories/PrismaProductionRepository';
import { StepBuilder } from '@/step-production/domain/core/StepBuilder';
import { Status } from '@/step-production/domain/core/StepStatus';
import {
    setListActionsForForeignKey,
    setupTestEnvironment,
    teardownTestEnvironment,
} from '../fixtureContainerPrisma';

describe('Step-Production (e2e)', () => {
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
        await setListActionsForForeignKey();
    }, 50000);
    afterAll(async () => {
        await teardownTestEnvironment(container, prismaClient);
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [StepProductionModule],
        })
            .overrideProvider(PrismaClient)
            .useValue(prismaClient)
            .overrideProvider(DateService)
            .useValue(dateProvider)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await prismaClient.stepProduction.deleteMany();
    });

    describe(" Step Production Controller's", () => {
        describe('step creation', () => {
            const pathUrl = '/step/create';
            it('should create the step into the DB returning a 201', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);

                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ operatorId: '1', action: 1, model: 'model 1' })
                    .expect(201);

                const data = await stepProductionRepo.getLastActiveStepByOperatorId('1');
                expect(data).toEqual(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withAction(1)
                        .withModel('model 1')
                        .withStart(now)
                        .build(),
                );
            });
            it.each([
                { action: 1, model: 'model 1' },
                { operatorId: '1', model: 'model 1' },
                { operatorId: '1', action: 1 },
            ])(
                'should return an Validation error when the body is missing one of the required fields: %s',
                async (sendBody) => {
                    await request(app.getHttpServer()).post(pathUrl).send(sendBody).expect(403);
                },
            );

            it('should return an error when the operator is already openning a step', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(
                    new StepBuilder().withOperatorId('1').withStatus(Status.IN_PROGRESS).build(),
                );

                await request(app.getHttpServer())
                    .post(pathUrl)
                    .send({ operatorId: '1', action: 1, model: 'model 2' })
                    .expect(400);
            });
        });
        describe('step cancellation', () => {
            const pathUrl = '/step/cancel';
            it('should cancel the step into the DB', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withStatus(Status.IN_PROGRESS)
                        .build(),
                );

                await request(app.getHttpServer()).patch(pathUrl).send({ stepId: 1 }).expect(200);

                const data = await stepProductionRepo.getStepById(1);
                expect(data).toEqual(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withStatus(Status.CANCELED)
                        .withEnd(dateProvider.nowDate)
                        .build(),
                );
            });

            it('should return the 400 bad Request case non existing and already closed ', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withStatus(Status.CANCELED)
                        .withEnd(dateProvider.nowDate)
                        .build(),
                );

                await request(app.getHttpServer()).patch(pathUrl).send({ stepId: 2 }).expect(400);

                await request(app.getHttpServer()).patch(pathUrl).send({ stepId: 1 }).expect(400);
            });
        });
        describe('step Ending', () => {
            const pathUrl = '/step/end';
            it('should end the step into the DB with status ended and a productivity', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withStatus(Status.IN_PROGRESS)
                        .withStart(new Date('2023-02-14T15:00:00.000Z'))
                        .build(),
                );

                await request(app.getHttpServer())
                    .patch(pathUrl)
                    .send({
                        stepId: 1,
                        bonne: 100,
                        rebut: 10,
                    })
                    .expect(200);

                const data = await stepProductionRepo.getStepById(1);
                expect(data?.toState().status).toEqual(Status.ENDED);
                expect(data?.toState().productivity).toBeGreaterThan(0);
            });

            it('should return the 400 bad Request case non existing and already closed ', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(
                    new StepBuilder()
                        .withOperatorId('1')
                        .withId(1)
                        .withStatus(Status.ENDED)
                        .withEnd(dateProvider.nowDate)
                        .build(),
                );

                await request(app.getHttpServer()).patch(pathUrl).send({ stepId: 2 }).expect(400);

                await request(app.getHttpServer()).patch(pathUrl).send({ stepId: 1 }).expect(400);
            });
        });
        describe('step service', () => {
            it('should return the last step by operator', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(new StepBuilder().withOperatorId('OP-1').build());

                const response = await request(app.getHttpServer())
                    .get('/step/operator/OP-1')
                    .expect(200);
                expect(response.body).toEqual(
                    new StepBuilder().withOperatorId('OP-1').build().toState(),
                );
            });
            it('should return the step by id', async () => {
                const stepProductionRepo = new PrismaProductionRepository(prismaClient);
                await stepProductionRepo.save(new StepBuilder().withId(12).build());

                const response = await request(app.getHttpServer()).get('/step/12').expect(200);
                expect(response.body).toEqual(new StepBuilder().withId(12).build().toState());
            });
        });
    });
    describe(" Operator Machine Controller's", () => {});
});
