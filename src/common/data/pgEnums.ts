import { enumToPgEnum } from "@util/enumToPgEnum";
import { pgEnum } from "drizzle-orm/pg-core";

export enum Role {
  ADMIN = "ADMIN",
  HR = "HR",
}

export const roleEnum = pgEnum("role", enumToPgEnum(Role));

export const UserRole = pgEnum("user_role", ["ADMIN", "HR"]);

export const FrequencyType = pgEnum("frequency_type", ["MONTHLY", "SPECIAL"]);

export const Direction = pgEnum("direction", ["ADDITION", "DEDUCTION"]);

export const PayslipStatus = pgEnum("payslip_status", [
  "DRAFT",
  "PROCESSED",
  "PAID",
]);

export type HoursMetadata = {
  hours?: number;
  hourRate?: number;
  multiplier?: number;
};

/*

--> Safe Migrations
--------------------
DO $$
BEGIN
    -- Create user_role type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ADMIN', 'HR');
    END IF;

    -- Create frequency_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'frequency_type') THEN
        CREATE TYPE frequency_type AS ENUM ('MONTHLY', 'SPECIAL');
    END IF;

    -- Create payslip_status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payslip_status') THEN
        CREATE TYPE payslip_status AS ENUM ('DRAFT', 'PROCESSED', 'PAID');
    END IF;

    -- Create direction if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'direction') THEN
        CREATE TYPE direction AS ENUM ('ADDITION', 'DEDUCTION');
    END IF;
END
$$;

-------------------------------------------------------------
--> SQL Statement must apply manually

CREATE TYPE user_role AS ENUM ('ADMIN', 'HR');
CREATE TYPE frequency_type AS ENUM ('MONTHLY', 'SPECIAL');
CREATE TYPE payslip_status AS ENUM ('DRAFT', 'PROCESSED', 'PAID');
CREATE TYPE direction AS ENUM ('ADDITION', 'DEDUCTION');

*/
