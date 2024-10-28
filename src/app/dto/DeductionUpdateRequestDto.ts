import { z } from "zod";
import { frequencyType } from "@config/constants";

export const DeductionUpdateRequestDto = z.object({
  body: z.object({
    deductionTypeId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    amount: z
      .number()
      .positive()
      .transform((val) => val.toString()),
  }),

  params: z.object({
    id: z
      .string({ message: "Deduction ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
