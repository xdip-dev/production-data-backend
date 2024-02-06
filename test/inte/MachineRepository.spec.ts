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
    }, 30000);
    afterAll(async () => {
        await teardownTestEnvironment(container, prismaClient);
    });

    beforeEach(async () => {
        await prismaClient.machines.deleteMany();
    });

    it('should create a machine and throw on duplicate', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await machineRepo.save({ id: 'M-1', name: 'machine1', barcode: 'M-1' });
        const machines = await prismaClient.machines.findFirstOrThrow({
            where: { ID: 'M-1' },
        });

        expect(machines).toEqual({
            ID: 'M-1',
            NAME: 'machine1',
            BARCODE: 'M-1',
        });
        await expect(
            machineRepo.save({ id: 'M-1', name: 'machine1', barcode: 'M-1' }),
        ).rejects.toThrow();
    });

    it('should modify a machine and Throw if not found', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.create({
            data: {
                ID: 'M-1',
                NAME: 'machine1',
                BARCODE: 'M-1',
            },
        });

        await machineRepo.modifyName({ id: 'M-1', name: 'machine2' });
        const machines = await prismaClient.machines.findFirstOrThrow({
            where: { ID: 'M-1' },
        });
        expect(machines).toEqual({
            ID: 'M-1',
            NAME: 'machine2',
            BARCODE: 'M-1',
        });
        await expect(machineRepo.modifyName({ id: 'M-2', name: 'machine1' })).rejects.toThrow();
    });
    it('should delete a machine and Throw if not found', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.create({
            data: {
                ID: 'M-1',
                NAME: 'machine1',
                BARCODE: 'M-1',
            },
        });

        await machineRepo.delete('M-1');
        const machines = await prismaClient.machines.findFirst({
            where: { ID: 'M-1' },
        });
        expect(machines).toBeNull();
        await expect(machineRepo.delete('2')).rejects.toThrow();
    });
    it('should get all machines', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.createMany({
            data: [
                { ID: 'M-1', NAME: 'machine1', BARCODE: 'M-1' },
                { ID: 'M-2', NAME: 'machine2', BARCODE: 'M-2' },
            ],
        });

        const machines = await machineRepo.getAllMachines();
        expect(machines).toEqual([
            { id: 'M-1', name: 'machine1', barcode: 'M-1' },
            { id: 'M-2', name: 'machine2', barcode: 'M-2' },
        ]);
    });
    it('should get the last machine id', async () => {
        const machineRepo = new PrismaMachineRepository(prismaClient);
        await prismaClient.machines.createMany({
            data: [
                { ID: 'M-1', NAME: 'machine1', BARCODE: 'M-1' },
                { ID: 'M-3', NAME: 'machine3', BARCODE: 'M-3' },
                { ID: 'M-2', NAME: 'machine2', BARCODE: 'M-2' },
            ],
        });

        const id = await machineRepo.getLastId();
        expect(id).toEqual('M-3');
    });
});
