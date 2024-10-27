import { z } from "zod";

export const AdditionCreateRequestDto = z.object({
  body: z.object({
    additionTypeId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    amount: z
      .number()
      .positive()
      .transform((val) => val.toString()),
  }),
});
