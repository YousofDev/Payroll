import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { AdditionType } from "./AdditionType";
import { FrequencyType } from "@data/pgEnums";

export const Addition = pgTable("additions", {
  id: serial("id").primaryKey(),
  additionTypeId: integer("addition_type_id")
    .references(() => AdditionType.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: integer("employee_id")
    .references(() => Employee.id, {
      onDelete: "cascade",
    })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequencyType: FrequencyType().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type NewAdditionModel = InferInsertModel<typeof Addition>;
export type AdditionModel = InferSelectModel<typeof Addition>;
