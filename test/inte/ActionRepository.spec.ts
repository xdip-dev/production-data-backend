import { PrismaClient } from '@prisma/client';
import { setupTestEnvironment, teardownTestEnvironment } from '../fixtureContainerPrisma';
import { StartedTestContainer } from 'testcontainers';
import { PrismaActionRepository } from '@/actions/infrastructure/adapters/repository/PrismaActionRepository';

describe('Action Repository', () => {
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;
    let actionRepo: PrismaActionRepository;
    beforeAll(async () => {
        const setup = await setupTestEnvironment();
        container = setup.container;
        prismaClient = setup.prismaClient;
    }, 20000);
    afterAll(async () => {
        await teardownTestEnvironment(container, prismaClient);
    });

    beforeEach(async () => {
        await prismaClient.listActions.deleteMany();
        await prismaClient.$executeRawUnsafe(
            `TRUNCATE TABLE public."ListActions" RESTART IDENTITY`,
        );
        actionRepo = new PrismaActionRepository(prismaClient);
    });
    it('should create an action and throw on duplicate', async () => {
        await actionRepo.save({ name: 'ActionCreation1', zone: 'A' });
        const actions = await prismaClient.listActions.findFirstOrThrow({
            where: { ID: 1 },
        });

        expect(actions).toEqual({
            ID: 1,
            NAME: 'ActionCreation1',
            ZONE: 'A',
        });
        await expect(actionRepo.save({ name: 'ActionCreation1', zone: 'B' })).rejects.toThrow();
    });
    it('should modify an action and Throw if not found', async () => {
        await prismaClient.listActions.create({
            data: {
                NAME: 'action1',
                ZONE: 'A',
            },
        });

        await actionRepo.modify({ id: 1, name: 'action2', zone: 'B' });
        const actions = await prismaClient.listActions.findFirstOrThrow({
            where: { ID: 1 },
        });
        expect(actions).toEqual({
            ID: 1,
            NAME: 'action2',
            ZONE: 'B',
        });
        await expect(actionRepo.modify({ id: 2, name: 'action1', zone: 'A' })).rejects.toThrow();
    });
    it('should delete an action and Throw if not found', async () => {
        await prismaClient.listActions.create({
            data: {
                NAME: 'action1',
                ZONE: 'A',
            },
        });

        await actionRepo.delete(1);
        await expect(actionRepo.delete(2)).rejects.toThrow();
    });
    it('should get all actions', async () => {
        await prismaClient.listActions.createMany({
            data: [
                {
                    NAME: 'action1',
                    ZONE: 'A',
                },
                {
                    NAME: 'action2',
                    ZONE: 'B',
                },
            ],
        });
        const actions = await actionRepo.getAllActions();
        expect(actions).toEqual([
            {
                id: 1,
                name: 'action1',
                zone: 'A',
            },
            {
                id: 2,
                name: 'action2',
                zone: 'B',
            },
        ]);
    });
});
