import { z } from "zod";

export const EmployeeIdRequestDto = z.object({
  params: z.object({
    employeeId: z
      .string({
        required_error: "Employee id is required",
      })
      .transform((employeeId) => parseInt(employeeId)),
  }),
});
