import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  date,
  decimal,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const Employee = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  phone: varchar("phone", { length: 15 }),
  position: varchar("position", { length: 50 }),
  department: varchar("department", { length: 50 }),
  location: varchar("location", { length: 50 }),
  basicSalary: decimal("basic_salary", { precision: 10, scale: 2 }).notNull(),
  hourRate: decimal("hour_rate", { precision: 10, scale: 2 }), // can be auto calculated(basicSalary / 30)
  hireDate: date("hire_date"),
  terminationDate: date("termination_date"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type NewEmployeeModel = InferInsertModel<typeof Employee>;
export type EmployeeModel = InferSelectModel<typeof Employee>;
