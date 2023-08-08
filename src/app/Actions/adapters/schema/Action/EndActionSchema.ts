import zod from "zod";

export const EndActionSchema = zod.object({
  actionId: zod.number(),
  bonne: zod.optional(zod.number()),
  rebut: zod.optional(zod.number()),
  actionProblem: zod.optional(zod.string()),

});

