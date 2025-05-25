import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { Employee } from "@app/model/Employee";
import { AdditionType } from "@app/model/AdditionType";
import { HoursMetadata } from "@data/pgTypes";

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
  metadata: jsonb("metadata").$type<HoursMetadata>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type NewAdditionModel = InferInsertModel<typeof Addition>;
export type AdditionModel = InferSelectModel<typeof Addition>;
