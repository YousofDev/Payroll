import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "blue",
  silly: "gray",
};

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += " " + JSON.stringify(metadata);
  }
  return msg;
});

export const logger = winston.createLogger({
  levels: logLevels,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "http",
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        logFormat
      ),
    }),
    new DailyRotateFile({
      level: "http",
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

winston.addColors(logColors);

export const morganMiddleware = morgan(
  (tokens, req: Request, res: Response) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res) || ""),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res) || ""),
      user_agent: tokens["user-agent"](req, res),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`HTTP ${data.method} ${data.url}`, data);
      },
    },
  }
);

const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next(err);
};

const logRequestResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  logger.info(`Request: ${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `Response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`,
      {
        headers: res.getHeaders(),
        body: res.locals.body,
      }
    );
  });

  next();
};

const logResponseBody = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.locals.body = body;
    return originalSend.apply(res, arguments as any);
  };

  next();
};
