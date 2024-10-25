import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "./Employee";
import { AdditionType } from "./AdditionType";
import { FrequencyType } from "@data/pgEnums";

export const Addition = pgTable("additions", {
  id: serial("id").primaryKey(),
  additionTypeId: integer("addition_type_id").references(
    () => AdditionType.id,
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

export type NewAdditionModel = InferInsertModel<typeof Addition>;
export type AdditionModel = InferSelectModel<typeof Addition>;
