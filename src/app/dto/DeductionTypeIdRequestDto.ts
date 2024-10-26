import { z } from "zod";

export const DeductionTypeIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({message: "Deduction type ID Required"})
      .transform((id) => parseInt(id)),
  }),
});
