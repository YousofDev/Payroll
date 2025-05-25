import { z } from "zod";

export const UserLoginRequestDto = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export type UserLoginType = z.infer<typeof UserLoginRequestDto>["body"];
