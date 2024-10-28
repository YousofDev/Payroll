import { z } from "zod";
import { frequencyType } from "@config/constants";

export const DeductionCreateRequestDto = z.object({
  body: z.object({
    deductionTypeId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    amount: z
      .number()
      .positive()
      .transform((val) => val.toString()),
  }),
});
