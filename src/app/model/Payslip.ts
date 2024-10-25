import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
  date,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { Direction } from "@data/pgEnums";





export const Payslip = pgTable(
  "pay_slips",
  {
    id: serial("id").primaryKey(),
    // payslipStatus: PayslipStatus(),
    employeeId: integer("employee_id").references(() => Employee.id, {
      onDelete: "cascade",
    }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    basicSalary: decimal("basic_salary").notNull(),
    totalAdditions: decimal("total_additions").notNull(),
    totalDeductions: decimal("total_deductions").notNull(),
    netSalary: decimal("net_salary").notNull(),
    companyName: varchar("company_name", { length: 100 }),
    companyAddress: varchar("company_address"),
    companyLogo: varchar("company_logo"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      uniquePayslip: unique("unique_employee_payslip_period").on(
        table.employeeId,
        table.startDate,
        table.endDate
      ),
    };
  }
);

export const PayslipItem = pgTable("payslip_items", {
  id: serial("id").primaryKey(),
  payslipId: integer("payslip_id").references(() => Payslip.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  direction: Direction(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

export type NewPayslipModel = InferInsertModel<typeof Payslip>;
export type PayslipModel = InferSelectModel<typeof Payslip>;

export type NewPayslipItemModel = InferInsertModel<typeof PayslipItem>;
export type PayslipItemModel = InferSelectModel<typeof PayslipItem>;

export interface PayslipWithItems extends PayslipModel {
  items?: PayslipItemModel[];
}
