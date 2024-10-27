import "@config/dependencyContainer";
import { env } from "@config/env";
import { app } from "@config/app";
import { logger } from "@util/logger";
import { handleUndefinedRoutes } from "@middleware/handleUndefinedRoutes";
import errorHandler from "@middleware/errorHandler";
import { employeeRoutes } from "@app/route/employeeRoutes";
import { additionTypeRoutes } from "@app/route/additionTypeRoutes";
import { deductionTypeRoutes } from "@app/route/deductionTypeRoutes";
import { additionRoutes } from "@app/route/additionRoutes";
import { deductionRoutes } from "@app/route/deductionRoutes";
import { payslipRoutes } from "@app/route/payslipRoutes";

app.use(employeeRoutes);
app.use(additionTypeRoutes);
app.use(deductionTypeRoutes);
app.use(additionRoutes);
app.use(deductionRoutes);
app.use(payslipRoutes);

app.all("*", handleUndefinedRoutes);
// app.use(errorHandler);

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});
