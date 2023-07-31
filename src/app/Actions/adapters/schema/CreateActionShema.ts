import zod from "zod";

export const CreateActionSchema = zod.object({
  operatorId: zod.string(),
  action: zod.string(),
  model: zod.string(),
});
