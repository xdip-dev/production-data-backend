import zod from "zod";

export const GenerateBarcodePdfSchema = zod.object({
	barcode: zod.string(),
});
