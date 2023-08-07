import zod from "zod";

export const AddAllActionsSchema = zod.object({
	action: zod.string(),
	zone: zod.string(),
});
