import { z } from "zod";
import { userRole } from "@config/constants";

export const UserAssignRoleRequestDto = z.object({
  body: z.object({
    role: z.enum(userRole), // ADMIN / HR
  }),
  params: z.object({
    id: z
      .string({ message: "ID Required" })
      .regex(/^-?\d+$/, { message: "ID must be a number" })
      .transform((id) => parseInt(id)),
  }),
});

export type UserAssignRoleType = z.infer<
  typeof UserAssignRoleRequestDto
>["body"];
