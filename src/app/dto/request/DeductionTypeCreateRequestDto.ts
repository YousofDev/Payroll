import { z } from "zod";
import { frequencyType } from "@config/constants";

export const DeductionTypeCreateRequestDto = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    frequencyType: z.enum(frequencyType), // MONTHLY / SPECIAL
  }),
});
