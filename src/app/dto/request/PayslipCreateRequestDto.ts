import * as z from "zod";
import { payslipStatus } from "@config/constants";

export const PayslipCreateRequestDto = z.object({
  body: z
    .object({
      employeeIds: z.array(z.number().int().positive()).min(1),
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
      payslipStatus: z.enum(payslipStatus), // "DRAFT", "PROCESSED", "PAID"
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
