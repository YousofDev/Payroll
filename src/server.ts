import "@config/dependencyContainer";
import { env } from "@config/env";
import { app } from "@config/app";
import { logger } from "@util/logger";
import { handleUndefinedRoutes } from "@middleware/handleUndefinedRoutes";
import errorHandler from "@middleware/errorHandler";
import { employeeRoutes } from "@app/route/employeeRoutes";
import { additionRoutes } from "@app/route/additionRoutes";
import { deductionTypeRoutes } from "@app/route/deductionTypeRoutes";
import { additionTypeRoutes } from "@app/route/additionTypeRoutes";

app.use(employeeRoutes);
app.use(additionTypeRoutes);
app.use(deductionTypeRoutes);
app.use(additionRoutes);

app.all("*", handleUndefinedRoutes);
app.use(errorHandler);

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});
