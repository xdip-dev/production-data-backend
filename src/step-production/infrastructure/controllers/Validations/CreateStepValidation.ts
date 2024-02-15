import * as zod from 'zod';

export const CreateStepSchema = zod.object({
    operatorId: zod.string(),
    action: zod.number(),
    model: zod.string(),
    previousStepsIds: zod.number().array().optional(),
    reference: zod.string().optional(),
    matrice: zod.string().optional(),
});

export type CreateStepDto = zod.infer<typeof CreateStepSchema>;
