import { pgEnum } from "drizzle-orm/pg-core";

export const FrequencyType = pgEnum("frequency_type", ["MONTHLY", "SPECIAL"]);

export const Direction = pgEnum("direction", ["ADDITION", "DEDUCTION"]);

export const PayslipStatus = pgEnum("payslip_status ", [
  "DRAFT",
  "PROCESSED",
  "PAID",
]);

/*

--> SQL Statement must apply manually

CREATE TYPE frequency_type AS ENUM ('MONTHLY', 'SPECIAL');
CREATE TYPE payslip_status AS ENUM ('DRAFT', 'PROCESSED', 'PAID');
CREATE TYPE direction AS ENUM ('ADDITION', 'DEDUCTION');

*/
