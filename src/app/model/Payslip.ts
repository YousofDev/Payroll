import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  date,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { Direction, PayslipStatus } from "@data/pgEnums";

export const Payslip = pgTable(
  "payslips",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id")
      .references(() => Employee.id, {
        onDelete: "cascade",
      })
      .notNull(),
    payPeriodStart: date("pay_period_start").notNull(),
    payPeriodEnd: date("pay_period_end").notNull(),
    payslipStatus: PayslipStatus("payslip_status").notNull(),
    basicSalary: decimal("basic_salary").notNull(),
    totalAdditions: decimal("total_additions").notNull(),
    totalDeductions: decimal("total_deductions").notNull(),
    netSalary: decimal("net_salary").notNull(),
    employeeName: varchar("employee_name", { length: 100 }).notNull(),
    companyName: varchar("company_name", { length: 100 }).notNull(),
    companyAddress: varchar("company_address").notNull(),
    companyLogo: varchar("company_logo"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const PayslipItem = pgTable("payslip_items", {
  id: serial("id").primaryKey(),
  payslipId: integer("payslip_id")
    .references(() => Payslip.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  direction: Direction("direction").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

export type NewPayslipModel = InferInsertModel<typeof Payslip>;
export type PayslipModel = InferSelectModel<typeof Payslip>;

export type NewPayslipItemModel = InferInsertModel<typeof PayslipItem>;
export type PayslipItemModel = InferSelectModel<typeof PayslipItem>;

export interface NewPayslipModelWithItems extends NewPayslipModel {
  payslipItems: NewPayslipItemModel[];
}
export interface PayslipModelWithItems extends PayslipModel {
  payslipItems: PayslipItemModel[];
}
