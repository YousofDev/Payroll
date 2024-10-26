import { z } from "zod";

export const EmployeeIdRequestDto = z.object({
  params: z.object({
    employeeId: z
      .string()
      .transform((employeeId) => parseInt(employeeId)),
  }),
});
