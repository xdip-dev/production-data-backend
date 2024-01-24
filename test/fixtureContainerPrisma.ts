import { PrismaClient } from '@prisma/client';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { promisify } from 'util';
import { exec } from 'child_process';

let container: StartedTestContainer;
let prismaClient: PrismaClient;

const asyncExec = promisify(exec);

export async function setupTestEnvironment() {
    container = await new GenericContainer('postgres')
        .withEnvironment({ POSTGRES_PASSWORD: 'prod-test' })
        .withEnvironment({ POSTGRES_USER: 'prod-test' })
        .withEnvironment({ POSTGRES_DB: 'prod-test' })
        .withExposedPorts(5432)
        .start();
    const databaseUrl = `postgresql://prod-test:prod-test@${container.getHost()}:${container.getMappedPort(
        5432,
    )}/prod-test?schema=public`;
    prismaClient = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
    });

    const { stderr } = await asyncExec('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
    });
    if (stderr) {
        console.log('err', stderr);
    } else {
        console.log('Prisma OK deployement');
    }
    await prismaClient.$connect();
    return { container, prismaClient };
}

export async function teardownTestEnvironment(
    container: StartedTestContainer,
    prismaClient: PrismaClient,
) {
    await container.stop({ timeout: 3000 });
    await prismaClient.$disconnect();
}
