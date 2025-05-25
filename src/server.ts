import { env } from "@config/env";
import { app } from "@config/app";
import { logger } from "@util/logger";

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});

const signals = [
  "SIGINT",
  "SIGTERM",
  "uncaughtException",
  "unhandledRejection",
];

for (const signal of signals) {
  process.on(signal, (reason) => {
    logger.error(`${signal}, 💥 Gracefully Shutting down... ${reason}`);
    server.close(() => {
      process.exit(1);
    });
  });
}
