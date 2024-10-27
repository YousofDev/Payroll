import * as z from "zod";
import { payslipStatus } from "@util/constants";

export const PayslipCreateRequestDto = z.object({
  body: z
    .object({
      employeeId: z.number().int().positive(),
      payPeriodStart: z
        .string()
        .refine((dateString) => !isNaN(Date.parse(dateString)), {
          message: "Invalid date format for payPeriodStart",
        }),
      payPeriodEnd: z
        .string()
        .refine((dateString) => !isNaN(Date.parse(dateString)), {
          message: "Invalid date format for payPeriodEnd",
        }),
      payslipStatus: z.enum(payslipStatus),
      companyName: z.string().max(50),
      companyAddress: z.string().max(100),
      companyLogo: z.string().optional(),
    })
    .refine((data) => data.payPeriodEnd > data.payPeriodStart, {
      message: "payPeriodEnd must be after payPeriodStart",
      path: ["payPeriodEnd"],
    }),
});

export type PayslipCreateRequestDtoType = z.infer<
  typeof PayslipCreateRequestDto
>["body"];
