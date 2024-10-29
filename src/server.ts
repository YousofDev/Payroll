import { env } from "@config/env";
import { app } from "@config/app";
import { logger } from "@util/logger";
import { undefinedRoutesHandler } from "@middleware/undefinedRoutesHandler";
import { globalErrorHandler } from "@middleware/globalErrorHandler";
import { userRoutes } from "@app/route/userRoutes";
import { employeeRoutes } from "@app/route/employeeRoutes";
import { additionTypeRoutes } from "@app/route/additionTypeRoutes";
import { deductionTypeRoutes } from "@app/route/deductionTypeRoutes";
import { additionRoutes } from "@app/route/additionRoutes";
import { deductionRoutes } from "@app/route/deductionRoutes";
import { payslipRoutes } from "@app/route/payslipRoutes";

app.use(userRoutes);
app.use(employeeRoutes);
app.use(additionTypeRoutes);
app.use(deductionTypeRoutes);
app.use(additionRoutes);
app.use(deductionRoutes);
app.use(payslipRoutes);

app.all("*", undefinedRoutesHandler);
app.use(globalErrorHandler);

const server = app.listen(env.PORT, `${env.HOST}`, () => {
  logger.info(`Server Started on http://${env.HOST}:${env.PORT}`);
});
