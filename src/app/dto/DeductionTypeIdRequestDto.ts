import { z } from "zod";

export const DeductionTypeIdRequestDto = z.object({
  params: z.object({
    deductionTypeId: z
      .string()
      .transform((deductionTypeId) => parseInt(deductionTypeId)),
  }),
});
