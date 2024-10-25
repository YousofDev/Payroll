import { controllers } from "@util/dependencyContainer";
import { app } from "@config/app";
import { env } from "@config/env";
import { logger } from "@util/logger";
import { handleUndefinedRoutes } from "@middleware/handleUndefinedRoutes";
import errorHandler from "@middleware/errorHandler";
import { createEmployeeRoutes } from "@app/route/employeeRoutes";

const employeeRoutes = createEmployeeRoutes(controllers.employeeController);

app.use(employeeRoutes);

app.all("*", handleUndefinedRoutes);
app.use(errorHandler);

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});
