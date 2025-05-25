import { z } from "zod";

export const IdParamRequestDto = z.object({
  params: z.object({
    id: z
      .string({ message: "ID Required" })
      .regex(/^-?\d+$/, { message: "ID must be a number" })
      .transform((id) => parseInt(id)),
  }),
});
