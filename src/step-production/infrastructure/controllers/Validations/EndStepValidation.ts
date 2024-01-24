import zod from 'zod';

export const EndStepSchema = zod.object({
    stepId: zod.number(),
    bonne: zod.optional(zod.number()),
    rebut: zod.optional(zod.number()),
    stepProblem: zod.optional(zod.string()),
});

export type EndStepDto = zod.infer<typeof EndStepSchema>;
