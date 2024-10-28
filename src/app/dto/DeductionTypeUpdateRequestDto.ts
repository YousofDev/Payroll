import { z } from "zod";
import { frequencyType } from "@config/constants";

export const DeductionTypeUpdateRequestDto = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    frequencyType: z.enum(frequencyType),
  }),

  params: z.object({
    id: z
      .string({ message: "Deduction type ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
