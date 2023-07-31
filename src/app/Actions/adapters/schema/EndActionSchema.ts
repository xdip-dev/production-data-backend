import zod from "zod";

export const EndActionSchema = zod.object({
  __id: zod.number(),
  bonne: zod.optional(zod.number()),
  rebut: zod.optional(zod.number()),
});

