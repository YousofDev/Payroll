import { FrequencyType } from "@data/pgEnums";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const AdditionType = pgTable("addition_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  frequencyType: FrequencyType().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NewAdditionTypeModel = InferInsertModel<typeof AdditionType>;
export type AdditionTypeModel = InferSelectModel<typeof AdditionType>;
