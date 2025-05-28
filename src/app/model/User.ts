import { UserRole } from "@data/pgEnums";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }),
    email: varchar("email", { length: 100 }).unique().notNull(),
    password: varchar("password").notNull(),
    role: UserRole("user_role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (user) => {
    return {
      userEmailIndex: uniqueIndex("user_email_idx").on(user.email),
    };
  }
);

export type NewUserModel = InferInsertModel<typeof User>;
export type UserModel = InferSelectModel<typeof User>;
