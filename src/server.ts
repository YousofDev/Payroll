import { controllers } from "@util/dependencyContainer";
import { app } from "@config/app";
import { env } from "@config/env";
import { logger } from "@util/logger";
import { handleUndefinedRoutes } from "@middleware/handleUndefinedRoutes";
import errorHandler from "@middleware/errorHandler";
import { createEmployeeRoutes } from "@app/route/employeeRoutes";
import { createAdditionTypeRoutes } from "@app/route/additionTypeRoutes";
import { createDeductionTypeRoutes } from "@app/route/deductionTypeRoutes";

const employeeRoutes = createEmployeeRoutes(controllers.employeeController);
const deductionTypeRoutes = createDeductionTypeRoutes(
  controllers.deductionTypeController
);
const additionTypeRoutes = createAdditionTypeRoutes(
  controllers.additionTypeController
);

app.use(employeeRoutes);
app.use(additionTypeRoutes);
app.use(deductionTypeRoutes);

app.all("*", handleUndefinedRoutes);
app.use(errorHandler);

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});
