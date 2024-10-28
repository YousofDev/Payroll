import { z } from "zod";

export const UserIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({message: "User ID Required"})
      .transform((id) => parseInt(id)),
  }),
});
