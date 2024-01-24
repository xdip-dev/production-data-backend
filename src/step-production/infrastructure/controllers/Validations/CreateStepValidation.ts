import * as zod from 'zod';

export const CreateStepSchema = zod.object({
    operatorId: zod.number(),
    action: zod.string(),
    model: zod.string(),
    previousAction: zod.number().optional(),
});

export type CreateStepDto = zod.infer<typeof CreateStepSchema>;
