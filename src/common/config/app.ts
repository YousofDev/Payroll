import "@config/dependencyContainer";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { morganMiddleware } from "@util/logger";
import { env } from "@config/env";
import { jwtAuthenticationFilter } from "@middleware/jwtAuthenticationFilter";
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

dotenv.config();

export const app = express();

app.use(helmet());
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morganMiddleware);

const corsOptions: CorsOptions = {
  origin: `http://${env.HOST}:${env.PORT}`,
};

app.use(cors(corsOptions));

app.use(express.static("public"));
app.use(express.static("views"));
app.set("view engine", "ejs");

app.use(jwtAuthenticationFilter);

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome API Home" });
});

app.use(userRoutes);
app.use(employeeRoutes);
app.use(additionTypeRoutes);
app.use(deductionTypeRoutes);
app.use(additionRoutes);
app.use(deductionRoutes);
app.use(payslipRoutes);

app.all("*", undefinedRoutesHandler);
app.use(globalErrorHandler);
