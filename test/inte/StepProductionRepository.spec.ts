import { PrismaClient } from '@prisma/client';
import { StartedTestContainer } from 'testcontainers';
import { PrismaProductionRepository } from '@/step-production/infrastructure/adapters/repositories/PrismaProductionRepository';
import { StepBuilder } from '@/step-production/domain/core/StepBuilder';
import { StepProductionMapper } from '@/step-production/infrastructure/adapters/repositories/StepProductionMapper';
import {
    setListActionsForForeignKey,
    setupTestEnvironment,
    teardownTestEnvironment,
} from '../fixtureContainerPrisma';
import { Status } from '@/step-production/domain/core/StepStatus';

describe('ProductionRepository', () => {
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;
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
        await prismaClient.stepProduction.deleteMany();
    });
    describe('save()', () => {
        it('should add a new entries', async () => {
            const productionRepository = new PrismaProductionRepository(prismaClient);
            await productionRepository.save(new StepBuilder().build());

            const expectedEntry_1 = await prismaClient.stepProduction.findFirstOrThrow({
                where: { STEP_ID: 1 },
            });
            expect(StepProductionMapper.toDomain(expectedEntry_1).toState()).toEqual(
                new StepBuilder().build().toState(),
            );

            await productionRepository.save(new StepBuilder().withId(2).build());
            const expectedEntry_2 = await prismaClient.stepProduction.findFirstOrThrow({
                where: { STEP_ID: 2 },
            });
            expect(StepProductionMapper.toDomain(expectedEntry_2).toState()).toEqual(
                new StepBuilder().withId(2).build().toState(),
            );
            expect(await prismaClient.stepProduction.count()).toEqual(2);
        });
        it('should update an existing entry', async () => {
            const productionRepository = new PrismaProductionRepository(prismaClient);
            await productionRepository.save(new StepBuilder().withId(1).build());
            await productionRepository.save(
                new StepBuilder().withId(1).withOperatorId('2').build(),
            );

            const expectedEntry = await prismaClient.stepProduction.findFirstOrThrow({
                where: { STEP_ID: 1 },
            });
            expect(StepProductionMapper.toDomain(expectedEntry).toState()).toEqual(
                new StepBuilder().withId(1).withOperatorId('2').build().toState(),
            );
            expect(await prismaClient.stepProduction.count()).toEqual(1);
        });
    });

    describe('get functions', () => {
        beforeEach(async () => {
            await prismaClient.stepProduction.createMany({
                data: [
                    StepProductionMapper.toRepository(
                        new StepBuilder().withId(1).withOperatorId('1').build(),
                    ),
                    StepProductionMapper.toRepository(
                        new StepBuilder()
                            .withId(2)
                            .withOperatorId('2')
                            .withStatus(Status.ENDED)
                            .build(),
                    ),
                    StepProductionMapper.toRepository(
                        new StepBuilder().withId(3).withOperatorId('3').build(),
                    ),
                    StepProductionMapper.toRepository(
                        new StepBuilder().withId(4).withOperatorId('2').build(),
                    ),
                ],
            });
        });
        it('should return the last step by operator id', async () => {
            const productionRepository = new PrismaProductionRepository(prismaClient);
            const lastStep = await productionRepository.getLastActiveStepByOperatorId('2');
            expect(lastStep?.toState()).toEqual(
                new StepBuilder().withId(4).withOperatorId('2').build().toState(),
            );
        });
        it('should return the last step id', async () => {
            const productionRepository = new PrismaProductionRepository(prismaClient);
            const lastStepId = await productionRepository.getLastStepId();
            expect(lastStepId).toEqual(4);
        });
        it('should return the step by id', async () => {
            const productionRepository = new PrismaProductionRepository(prismaClient);
            const step = await productionRepository.getStepById(3);
            expect(step?.toState()).toEqual(
                new StepBuilder().withId(3).withOperatorId('3').build().toState(),
            );
        });
    });
});
