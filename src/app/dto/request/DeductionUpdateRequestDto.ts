import { z } from "zod";

export const DeductionUpdateRequestDto = z.object({
  body: z
    .object({
      amount: z
        .number()
        .positive()
        .transform((val) => val.toString())
        .optional(),
      hours: z.number().positive().optional(),
      hourRate: z.number().positive().optional(),
      multipliers: z.number().positive().optional().default(1).optional(),
    })
    .refine(
      (data) => {
        // Condition 1: 'amount' is provided and valid, AND 'hours' and 'hourRate' are NOT provided
        const hasAmount = data.amount !== undefined && data.amount !== null;
        const noHoursOrRate =
          data.hours === undefined && data.hourRate === undefined;

        // Condition 2: 'hours' and 'hourRate' are both provided and valid, AND 'amount' is NOT provided
        const hasHoursAndRate =
          data.hours !== undefined && data.hourRate !== undefined;
        const noAmount = data.amount === undefined;

        // Valid if:
        // (amount is present AND hours/hourRate are absent)
        // OR
        // (hours and hourRate are present AND amount is absent)
        return (hasAmount && noHoursOrRate) || (hasHoursAndRate && noAmount);
      },
      {
        message:
          "Request body must contain either 'amount' or both 'hours' and 'hourRate'.",
      }
    ),

  params: z.object({
    id: z
      .string({ message: "Deduction ID Required" })
      .transform((id) => parseInt(id)),
  }),
});

export type DeductionUpdateType = z.infer<
  typeof DeductionUpdateRequestDto
>["body"];
