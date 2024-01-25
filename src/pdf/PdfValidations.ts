import zod from 'zod';

export const BarcodeSchema = zod.object({
    barcodeText: zod.string(),
    additionalText: zod.string().optional(),
});

export type BarcodeDto = zod.infer<typeof BarcodeSchema>;
