import zod from 'zod';

export const MachineSchema = zod.object({
    id: zod.number(),
    name: zod.string(),
});

export type MachineDto = zod.infer<typeof MachineSchema>;

export const IdValidationMachine = MachineSchema.pick({ id: true });

export const NameValidationMachine = MachineSchema.pick({ name: true });
