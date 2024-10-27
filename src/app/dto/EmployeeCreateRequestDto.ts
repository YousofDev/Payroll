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
      .number()
      .positive()
      .transform((val) => val.toString()),
    hireDate: z.date().optional(),
    terminationDate: z.date().optional(),
  }),
});

// export type EmployeeRequestDtoType = z.infer<typeof EmployeeRequestDto>["body"];
