import zod from "zod";

export const CancelActionSchema = zod.object({
  __id:zod.number(),
  });