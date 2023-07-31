import zod from "zod";

export const GetLastActionSchema = zod.object({
  operatorId: zod.string(),
});