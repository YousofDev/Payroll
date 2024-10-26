import { z } from "zod";

export const AdditionIdRequestDto = z.object({
  params: z.object({
    additionId: z
      .string()
      .transform((additionId) => parseInt(additionId)),
  }),
});
