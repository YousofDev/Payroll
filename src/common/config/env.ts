import zennv from "zennv";
import { z } from "zod";

export const env = zennv({
  dotenv: true,
  schema: z.object({
    DATABASE_CONNECTION: z.string(),
    TEST_DATABASE_CONNECTION: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().transform((val) => parseInt(val)),
    API_VERSION: z.string(),
    API_DOMAIN: z.string(),
    PUBLIC_API_URL: z.string(),
    PORT: z.number(),
    HOST: z.string(),
    NODE_ENV: z.string(),
  }),
});
