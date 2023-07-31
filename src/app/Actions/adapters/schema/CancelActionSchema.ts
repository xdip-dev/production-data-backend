import zod from "zod";

export const CancelActionSchema = zod.object({
  actionId:zod.number(),
  });