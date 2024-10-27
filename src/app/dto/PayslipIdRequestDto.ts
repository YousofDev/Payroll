import * as z from "zod";

export const PayslipIdRequestDto = z.object({
  params: z.object({
    id: z
      .string({ message: "Payslip ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
