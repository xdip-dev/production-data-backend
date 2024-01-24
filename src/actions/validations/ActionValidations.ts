import zod from 'zod';

export const ActionSchema = zod.object({
    id: zod.number(),
    name: zod.string(),
    zone: zod.string().optional(),
});

export type ActionDto = zod.infer<typeof ActionSchema>;

export const IdValidationAction = ActionSchema.pick({ id: true });

export const NameValidationAction = ActionSchema.omit({ id: true });
