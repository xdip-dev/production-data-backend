import zod from 'zod';

export const MatriceSchema = zod.object({
    code_id: zod.string(),
    designation: zod.string(),
});

export type MatriceDto = zod.infer<typeof MatriceSchema>;

export const IdValidationMatrice = MatriceSchema.pick({ code_id: true });

export const DesignationValidationMatrice = MatriceSchema.pick({ designation: true });
