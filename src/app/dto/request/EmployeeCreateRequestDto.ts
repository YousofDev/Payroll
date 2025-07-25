import { z } from "zod";

export const EmployeeCreateRequestDto = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email().max(100),
    phone: z.string().optional(),
    position: z.string().optional(),
    department: z.string().optional(),
    location: z.string().optional(),
    basicSalary: z
      .number()
      .positive()
      .transform((val) => val.toString()),
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
  }),
});

export type EmployeeCreateType = z.infer<
  typeof EmployeeCreateRequestDto
>["body"];
