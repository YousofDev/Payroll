import { env } from "@config/env";

export const permittedRoutes = [
  `${env.API_VERSION}/users/register`,
  `${env.API_VERSION}/users/login`,
  `${env.API_VERSION}`,
];

export const frequencyType = ["MONTHLY", "SPECIAL"] as const;
export const payslipStatus = ["DRAFT", "PROCESSED", "PAID"] as const;
export const DirectionType = ["ADDITION", "DEDUCTION"] as const;
export const employmentStatus = ["ACTIVE", "TERMINATED", "RETIRED"] as const;

export const userRole = ["ADMIN", "HR"] as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
