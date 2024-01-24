import { PrismaMachineRepository } from '@/machine/infrastructure/adapters/repository/PrismaMachineRepository';
import { PrismaClient } from '@prisma/client';
import { setupTestEnvironment, teardownTestEnvironment } from '../fixtureContainerPrisma';
import { StartedTestContainer } from 'testcontainers';

describe('MachineRepository', () => {
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;
    beforeAll(async () => {
        const setup = await setupTestEnvironment();
        container = setup.container;
        prismaClient = setup.prismaClient;
    }, 20000);
    afterAll(async () => {
        await teardownTestEnvironment(container, prismaClient);
    });

    beforeEach(async () => {
        await prismaClient.machines.deleteMany();
    });

    it('should create a machine and throw on duplicate', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await machineRepo.save({ id: 1, name: 'machine1', barcode: '1' });
        const machines = await prismaClient.machines.findFirstOrThrow({
            where: { ID: 1 },
        });

        expect(machines).toEqual({
            ID: 1,
            NAME: 'machine1',
            BARCODE: '1',
        });
        await expect(machineRepo.save({ id: 1, name: 'machine1', barcode: '1' })).rejects.toThrow();
    });

    it('should modify a machine and Throw if not found', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.create({
            data: {
                ID: 1,
                NAME: 'machine1',
                BARCODE: '1',
            },
        });

        await machineRepo.modifyName({ id: 1, name: 'machine2' });
        const machines = await prismaClient.machines.findFirstOrThrow({
            where: { ID: 1 },
        });
        expect(machines).toEqual({
            ID: 1,
            NAME: 'machine2',
            BARCODE: '1',
        });
        await expect(machineRepo.modifyName({ id: 2, name: 'machine1' })).rejects.toThrow();
    });
    it('should delete a machine and Throw if not found', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.create({
            data: {
                ID: 1,
                NAME: 'machine1',
                BARCODE: '1',
            },
        });

        await machineRepo.delete(1);
        const machines = await prismaClient.machines.findFirst({
            where: { ID: 1 },
        });
        expect(machines).toBeNull();
        await expect(machineRepo.delete(2)).rejects.toThrow();
    });
    it('should get all machines', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.createMany({
            data: [
                { ID: 1, NAME: 'machine1', BARCODE: '1' },
                { ID: 2, NAME: 'machine2', BARCODE: '2' },
            ],
        });

        const machines = await machineRepo.getAllMachines();
        expect(machines).toEqual([
            { id: 1, name: 'machine1', barcode: '1' },
            { id: 2, name: 'machine2', barcode: '2' },
        ]);
    });
    it('should get the last machine id', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.createMany({
            data: [
                { ID: 1, NAME: 'machine1', BARCODE: '1' },
                { ID: 3, NAME: 'machine3', BARCODE: '3' },
                { ID: 2, NAME: 'machine2', BARCODE: '2' },
            ],
        });

        const id = await machineRepo.getLastId();
        expect(id).toEqual(3);
    });
});
