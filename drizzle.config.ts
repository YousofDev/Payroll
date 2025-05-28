import { defineConfig } from "drizzle-kit";
import { env } from "./src/common/config/env";

export default defineConfig({
  out: "./src/common/data/migrations",
  schema: "./src/**/*/model/**/*.ts",
  dialect: "postgresql",
  breakpoints: false,
  dbCredentials: {
    url:
      env.NODE_ENV === "test"
        ? env.TEST_DATABASE_CONNECTION
        : env.DATABASE_CONNECTION,
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations",
    schema: "public",
  },
});
