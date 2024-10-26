import { z } from "zod";

export const EmployeeIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({message: "Employee ID Required"})
      .transform((id) => parseInt(id)),
  }),
});
