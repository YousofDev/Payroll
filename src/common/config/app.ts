import "@config/dependencyContainer";
import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { morganMiddleware } from "@util/logger";
import { env } from "@config/env";
import { jwtAuthenticationFilter } from "@middleware/jwtAuthenticationFilter";

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
