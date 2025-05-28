import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Simple environment variable access for migrations only
const getDatabaseUrl = () => {
  const nodeEnv = process.env.NODE_ENV;
  const dbConnection = process.env.DATABASE_CONNECTION;
  const testDbConnection = process.env.TEST_DATABASE_CONNECTION;

  if (nodeEnv === "test") {
    if (!testDbConnection) {
      throw new Error(
        "TEST_DATABASE_CONNECTION is required for test environment"
      );
    }
    return testDbConnection;
  }

  if (!dbConnection) {
    throw new Error("DATABASE_CONNECTION is required");
  }

  return dbConnection;
};

export default defineConfig({
  out: "./src/common/data/migrations",
  schema: "./src/**/*/model/**/*.ts",
  dialect: "postgresql",
  breakpoints: false,
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
  // Add migration configuration
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations",
    schema: "public",
  },
});
