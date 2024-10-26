import zennv from "zennv";
import { z } from "zod";

export const env = zennv({
  dotenv: true,
  schema: z.object({
    API_DOMAIN: z.string(),
    PUBLIC_API_URL: z.string(),
    PORT: z.number(),
    HOST: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DATABASE_CONNECTION: z.string(),
    JWT_SECRET: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRE: z.string(),
    REFRESH_TOKEN_EXPIRE: z.string(),
    COOKIE_EXPIRE: z.number().default(15),
    EMAIL_FROM: z.string(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.string(),
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
    DEBUG: z.string(),
    API_VERSION: z.string()
  }),
});
