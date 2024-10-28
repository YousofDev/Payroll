import * as z from "zod";
import { payslipStatus, directionType } from "@config/constants";

export const PayslipUpdateRequestDto = z.object({
  body: z
    .object({
      employeeId: z.number().int().positive(),
      startDate: z.date(),
      endDate: z.date(),
      payslipStatus: z.enum(payslipStatus),
      basicSalary: z
        .number()
        .positive()
        .transform((val) => val.toString()),
      totalAdditions: z
        .number()
        .nonnegative()
        .transform((val) => val.toString()),
      totalDeductions: z
        .number()
        .nonnegative()
        .transform((val) => val.toString()),
      netSalary: z
        .number()
        .positive()
        .transform((val) => val.toString()),
      companyName: z.string().max(100).optional(),
      companyAddress: z.string().optional(),
      companyLogo: z.string().optional(),

      payslipItems: z
        .array(
          z.object({
            payslipId: z.number().int().positive(),
            name: z.string().max(100),
            description: z.string().optional(),
            direction: z.enum(directionType),
            amount: z
              .number()
              .positive()
              .transform((val) => val.toString()),
          })
        )
        .nonempty({ message: "At least one payslip item is required" }),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    }),

  params: z.object({
    id: z
      .string({ message: "Payslip ID Required" })
      .transform((id) => parseInt(id)),
  }),
});
