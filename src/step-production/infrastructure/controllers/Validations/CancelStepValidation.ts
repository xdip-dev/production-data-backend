import zod from 'zod';

export const CancelStepSchema = zod.object({
    stepId: zod.number(),
});

export type CancelStepDto = zod.infer<typeof CancelStepSchema>;
