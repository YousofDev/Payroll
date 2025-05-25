import { z } from "zod";

export const EmployeeUpdateRequestDto = z.object({
  body: z
    .object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(2).max(50).optional(),
      email: z.string().email().max(100).optional(),
      phone: z.string().optional(),
      position: z.string().optional(),
      department: z.string().optional(),
      location: z.string().optional(),
      basicSalary: z
        .number()
        .positive()
        .transform((val) => val.toString())
        .optional(),
      hourRate: z
        .number()
        .positive()
        .transform((val) => val.toString())
        .optional(),
      hireDate: z
        .string()
        .refine((dateString) => !isNaN(Date.parse(dateString)), {
          message: "Invalid date format for hireDate",
        })
        .optional(),
      terminationDate: z
        .string()
        .refine((dateString) => !isNaN(Date.parse(dateString)), {
          message: "Invalid date format for terminationDate",
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided in the body.",
    }),

  params: z.object({
    id: z
      .string({ message: "Employee ID Required" })
      .transform((id) => parseInt(id)),
  }),
});

export type EmployeeUpdateType = z.infer<
  typeof EmployeeUpdateRequestDto
>["body"];
