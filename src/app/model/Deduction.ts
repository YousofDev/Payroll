import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "@app/model/Employee";
import { DeductionType } from "@app/model/DeductionType";
import { HoursMetadata } from "@data/pgEnums";

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
  metadata: jsonb("metadata").$type<HoursMetadata>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type NewDeductionModel = InferInsertModel<typeof Deduction>;
export type DeductionModel = InferSelectModel<typeof Deduction>;
