import { FrequencyType } from "@data/pgEnums";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const DeductionType = pgTable("deduction_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  frequencyType: FrequencyType().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NewDeductionTypeModel = InferInsertModel<typeof DeductionType>;
export type DeductionTypeModel = InferSelectModel<typeof DeductionType>;
