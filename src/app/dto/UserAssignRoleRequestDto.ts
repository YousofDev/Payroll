import { z } from "zod";
import { userRole } from "@config/constants";

export const UserAssignRoleRequestDto = z.object({
  body: z.object({
    role: z.enum(userRole),
  }),
  params: z.object({
    id: z
      .string({message: "User ID Required"})
      .transform((id) => parseInt(id)),
  }),
});

export type UserAssignRoleRequestDtoType = z.infer<typeof UserAssignRoleRequestDto>['body']
