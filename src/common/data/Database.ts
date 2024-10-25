import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@config/env";
import { logger } from "@util/logger";

const pool = new Pool({
  connectionString: env.DATABASE_CONNECTION,
});

export type DatabaseType = ReturnType<typeof drizzle>;

export const db = drizzle(pool);

export class Database {
  constructor() {
    logger.info("Database instance");
  }

  getConnection(): DatabaseType {
    return db;
  }
}
