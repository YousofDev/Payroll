import { z } from "zod";

export const DeductionIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({ message: "Deduction ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
