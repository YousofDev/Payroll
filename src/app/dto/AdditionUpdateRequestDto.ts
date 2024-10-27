import { z } from "zod";

export const AdditionUpdateRequestDto = z.object({
  body: z.object({
    additionTypeId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    amount: z
    .number()
    .positive()
    .transform((val) => val.toString()),
  }),

  params: z.object({
    id: z.string({message: "Addition ID Required"}).transform((id) => parseInt(id)),
  }),
});
