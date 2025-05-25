import { z } from "zod";
import { userRole } from "@config/constants";

export const UserRegisterRequestDto = z.object({
  body: z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(userRole), // ADMIN / HR
  }),
});
