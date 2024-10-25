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

    salary: z
      .union([
        z.string().refine((value) => /^[0-9]+(\.[0-9]+)?$/.test(value), {
          message:
            "Salary must be a valid number (digits and optional decimal point only)",
        }),
        z.number().min(1, "Salary must be a non-negative number"),
      ])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine((value) => Number.isFinite(value), {
        message: "Salary must be a valid number",
      })
      .transform((val) => val.toString()),

    hireDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => (date ? !isNaN(Date.parse(date)) : true),
        "Invalid date format"
      ),

    terminationDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => (date ? !isNaN(Date.parse(date)) : true),
        "Invalid date format"
      ),
  }),
});

// export type EmployeeRequestDtoType = z.infer<typeof EmployeeRequestDto>["body"];
