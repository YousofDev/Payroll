import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { DeductionType } from "./DeductionType";
import { FrequencyType } from "@data/pgEnums";


export const Deduction = pgTable("deductions", {
  id: serial("id").primaryKey(),
  deductionTypeId: integer("deduction_type_id").references(
    () => DeductionType.id,
    { onDelete: "cascade" }
  ),
  employeeId: integer("employee_id").references(() => Employee.id, {
    onDelete: "cascade",
  }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequencyType: FrequencyType().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NewDeductionModel = InferInsertModel<typeof Deduction>;
export type DeductionModel = InferSelectModel<typeof Deduction>;
