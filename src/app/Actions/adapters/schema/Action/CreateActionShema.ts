import zod from "zod";

export const CreateActionSchema = zod.object({
	operatorId: zod.number(),
	action: zod.string(),
	model: zod.string(),
	previousAction: zod.number().optional(),
});
