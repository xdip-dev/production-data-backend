import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';
import { setupTestEnvironment, teardownTestEnvironment } from '../fixtureContainerPrisma';
import { PrismaMatriceRepository } from '@/matrice/infrastructure/adapters/repository/PrismaMatriceRepository';
import { Matrice } from '@/matrice/domain/port/MatriceRepository';
import { MatriceModule } from '@/matrice/matrice.module';

describe('Matrice Module (e2e)', () => {
    let app: INestApplication;
    let container: StartedTestContainer;
    let prismaClient: PrismaClient;
    let matriceRepo: PrismaMatriceRepository;

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
            imports: [MatriceModule],
        })
            .overrideProvider(PrismaClient)
            .useValue(prismaClient)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await prismaClient.matrice.deleteMany();
        await prismaClient.$executeRawUnsafe(
            `TRUNCATE TABLE public."Matrice" RESTART IDENTITY CASCADE`,
        );
        matriceRepo = new PrismaMatriceRepository(prismaClient);
    });

    describe(" Matrice Controller's", () => {
        describe('matrice creation', () => {
            // const pathUrl = '/matrice';
            it('should create the matrice into the DB returning a 201', async () => {
                await request(app.getHttpServer())
                    .post('/matrice/create')
                    .send({ code_id: 'F89', designation: 'F 89 matrice' })
                    .expect(201);

                const data = await matriceRepo.getAllMatrice();
                const expected: Matrice[] = [
                    {
                        code_id: 'F89',
                        designation: 'F 89 matrice',
                        barcode: 'F89',
                    },
                ];
                expect(data).toEqual(expected);
            });
        });

        describe('matrice modification', () => {
            it('should modify the matrice name into the DB returning a 200', async () => {
                await matriceRepo.save({
                    code_id: 'F89',
                    designation: 'F 89 matrice',
                    barcode: 'F89',
                });
                await request(app.getHttpServer())
                    .patch('/matrice/modify')
                    .send({ code_id: 'F89', designation: 'F 89 matrice' })
                    .expect(200);

                const data = await matriceRepo.getAllMatrice();
                const expected: Matrice[] = [
                    {
                        code_id: 'F89',
                        designation: 'F 89 matrice',
                        barcode: 'F89',
                    },
                ];
                expect(data).toEqual(expected);
            });
        });

        describe('matrice deletion', () => {
            it('should delete the matrice from the DB returning a 200', async () => {
                await matriceRepo.save({
                    code_id: 'F89',
                    designation: 'F 89 matrice',
                    barcode: 'F89',
                });
                await request(app.getHttpServer())
                    .delete('/matrice/delete')
                    .send({ code_id: 'F89' })
                    .expect(200);

                const data = await matriceRepo.getAllMatrice();
                const expected: Matrice[] = [];
                expect(data).toEqual(expected);
            });
        });
    });
});
