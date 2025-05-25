import { FrequencyType } from "@data/pgTypes";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const DeductionType = pgTable("deduction_types", {
  id: serial("id").primaryKey(),
  frequencyType: FrequencyType("frequency_type").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type NewDeductionTypeModel = InferInsertModel<typeof DeductionType>;
export type DeductionTypeModel = InferSelectModel<typeof DeductionType>;
