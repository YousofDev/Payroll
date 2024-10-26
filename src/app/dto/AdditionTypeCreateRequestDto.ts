import { z } from "zod";
import { frequencyType } from "@util/constants";

export const AdditionTypeCreateRequestDto = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    frequencyType: z.enum(frequencyType),
  }),
});
