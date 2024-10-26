import { z } from "zod";
import { frequencyType } from "@util/constants";

export const DeductionUpdateRequestDto = z.object({
  body: z.object({
    deductionTypeId: z.number(),
    employeeId: z.number(),
    frequencyType: z.enum(frequencyType),
    amount: z
      .union([
        z.string().refine((value) => /^[0-9]+(\.[0-9]+)?$/.test(value)),
        z.number().min(1),
      ])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine((value) => Number.isFinite(value))
      .transform((val) => val.toString()),
  }),

  params: z.object({
    id: z
      .string({ message: "Deduction ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
