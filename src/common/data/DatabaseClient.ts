import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@config/env";
import { logger } from "@util/logger";

export class DatabaseClient {
  private static instance: DatabaseClient;
  private dbConnection: ReturnType<typeof drizzle>;

  private constructor() {
    const pool = new Pool({
      connectionString: env.NODE_ENV === "test" ? env.TEST_DATABASE_CONNECTION : env.DATABASE_CONNECTION,
    });

    this.dbConnection = drizzle(pool);
    logger.info("Database connection established.");
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public getConnection() {
    return this.dbConnection;
  }
}
