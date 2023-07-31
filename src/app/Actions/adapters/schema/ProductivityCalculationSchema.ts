import zod from "zod";

export const ProductivityCalculationSchema = zod.object({
  actionId:zod.number(),
  });