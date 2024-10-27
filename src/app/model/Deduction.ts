import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { DeductionType } from "./DeductionType";

export const Deduction = pgTable("deductions", {
  id: serial("id").primaryKey(),
  deductionTypeId: integer("deduction_type_id")
    .references(() => DeductionType.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: integer("employee_id")
    .references(() => Employee.id, {
      onDelete: "cascade",
    })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type NewDeductionModel = InferInsertModel<typeof Deduction>;
export type DeductionModel = InferSelectModel<typeof Deduction>;
