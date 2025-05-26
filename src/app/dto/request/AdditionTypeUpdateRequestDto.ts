import { z } from "zod";
import { frequencyType } from "@config/constants";

export const AdditionTypeUpdateRequestDto = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    frequencyType: z.enum(frequencyType), // "MONTHLY", "SPECIAL"
  }).refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided in the body.",
    }),

  params: z.object({
    id: z
      .string({ message: "Addition type ID Required" })
      .regex(/^-?\d+$/, { message: "ID must be a number" })
      .transform((id) => parseInt(id)),
  }),
});
