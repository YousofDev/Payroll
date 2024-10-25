import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { FrequencyType } from "@data/pgEnums";

export const AdditionType = pgTable("addition_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description"),
  frequencyType: FrequencyType(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NewAdditionTypeModel = InferInsertModel<typeof AdditionType>;
export type AdditionTypeModel = InferSelectModel<typeof AdditionType>;
