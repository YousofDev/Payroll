import { z } from "zod";

export const EmailParamRequestDto = z.object({
  params: z.object({
    email: z.string({ message: "Email Required" }).email(),
  }),
});
