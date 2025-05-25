import { z } from "zod";

export const AdditionCreateRequestDto = z.object({
  body: z
    .object({
      additionTypeId: z.number().int().positive(),
      employeeId: z.number().int().positive(),
    })
    .and(
      z.union([
        // Case when amount is provided
        z.object({
          amount: z
            .number()
            .positive()
            .transform((val) => val.toString()),
          hours: z.undefined(), // explicitly make hours undefined
          multipliers: z.undefined(), // these become irrelevant
          hourRate: z.undefined(),
        }),
        // Case when hours is provided
        z.object({
          hours: z
            .number()
            .positive(),
          hourRate: z
            .number()
            .positive(),
          multipliers: z
            .number()
            .positive()
            .optional()
            .default(1),
          amount: z.undefined(), // explicitly make amount undefined
        }),
      ])
    ),
});

export type AdditionCreateType = z.infer<
  typeof AdditionCreateRequestDto
>["body"];
