import { z } from "zod";

export const AdditionTypeIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({message: "Addition type ID Required"})
      .transform((id) => parseInt(id)),
  }),
});
