import { StepBuilder } from '@/step-production/domain/core/StepBuilder';

describe('Calculations tests', () => {
    describe('Productivity calcul', () => {
        it.each([
            { time: 5000, bonne: 10, rebut: 10, breakNumber: 0, expected: 250 },
            {
                time: 13542,
                bonne: 500,
                rebut: 23,
                breakNumber: 3,
                expected: 21,
            },
            { time: 3, bonne: 500, rebut: 23, breakNumber: 0, expected: 0 },
            {
                time: 90000,
                bonne: 1,
                rebut: 1,
                breakNumber: 0,
                expected: 45000,
            },
            { time: 5000, bonne: 0, rebut: 10, breakNumber: 0, expected: 500 },
            { time: 5000, bonne: 10, rebut: 0, breakNumber: 0, expected: 500 },
            { time: 0, bonne: 10, rebut: 10, breakNumber: 0, expected: 0 },
            { time: 0, bonne: 10, rebut: 10, breakNumber: 1, expected: null },
            {
                time: null,
                bonne: 10,
                rebut: 10,
                breakNumber: 0,
                expected: null,
            },
            { time: 5000, bonne: 0, rebut: 0, breakNumber: 0, expected: null },
        ])(
            'should calculate the productivity based on the time passed and the bonne pieces $time,$bonne,$rebut',
            async ({ time, bonne, rebut, breakNumber, expected }) => {
                const stepProduction = new StepBuilder()
                    .withBonne(bonne)
                    .withRebut(rebut)
                    .withTimeSeconde(time)
                    .withBreakNumber(breakNumber)
                    .build();

                stepProduction.setProductivity();
                expect(stepProduction.toState()).toEqual(
                    new StepBuilder()
                        .withProductivity(expected)
                        .withBonne(bonne)
                        .withRebut(rebut)
                        .withBreakNumber(breakNumber)
                        .withTimeSeconde(time)
                        .build()
                        .toState(),
                );
            },
        );
    });
    describe('break calcul', () => {
        it.each([
            {
                start: new Date(2023, 6, 30, 9, 45, 0),
                end: new Date(2023, 6, 30, 10, 45, 0),
                expectedBreakNumber: 0,
            },
            {
                start: new Date(2023, 6, 30, 8, 45, 0),
                end: new Date(2023, 6, 30, 10, 45, 0),
                expectedBreakNumber: 1,
            },
            {
                start: new Date(2023, 6, 30, 11, 20, 0),
                end: new Date(2023, 6, 30, 11, 45, 0),
                expectedBreakNumber: 0,
            },
            {
                start: new Date(2023, 6, 30, 7, 45, 0),
                end: new Date(2023, 6, 30, 13, 45, 0),
                expectedBreakNumber: 3,
            },
            {
                start: new Date(2023, 6, 30, 7, 0, 0),
                end: new Date(2023, 6, 30, 15, 0, 0),
                expectedBreakNumber: 3,
            },
            {
                start: new Date(2023, 6, 30, 7, 0, 0),
                end: new Date(2023, 6, 31, 15, 0, 0),
                expectedBreakNumber: 6,
            },
        ])(
            'should set break number to expected : $expectedBreakNumber',
            async ({ start, end, expectedBreakNumber }) => {
                const stepProduction = new StepBuilder()
                    .withStart(start)
                    .withEnd(end)
                    .build();
                stepProduction.setBreakNumber();
                expect(stepProduction.toState()).toEqual(
                    new StepBuilder()
                        .withBreakNumber(expectedBreakNumber)
                        .withStart(start)
                        .withEnd(end)
                        .build()
                        .toState(),
                );
            },
        );
    });
});
