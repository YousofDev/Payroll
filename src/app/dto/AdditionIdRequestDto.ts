import { z } from "zod";

export const AdditionIdRequestDto = z.object({
  params: z.object({
    id: z
      .string()
      .transform((id) => parseInt(id)),
  }),
});
