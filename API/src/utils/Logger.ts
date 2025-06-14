import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
// destructuring formats needed for winston using winston.format
const { combine, timestamp, printf, errors, colorize } = winston.format;
// combine is used to combine different formats into single format

const logFormat = printf((info: winston.Logform.TransformableInfo) => {
  return `${info.timestamp} ${info.level}: ${String(info.message)}${
    info.stack ? `\n${info.stack}` : ""
  }`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH-mm-ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // console transports with colors
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // Daily rotating file transport for all logs
    new DailyRotateFile({
      dirname: "./logs",
      filename: "combine-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "30m",
      maxFiles: "30d",
      utc: true,
      extension: ".log",
      level: "info",
    }),
    // Daily rotating file transport for Error logs
    new DailyRotateFile({
      dirname: "./logs",
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: "30d",
      maxSize: "30m",
      zippedArchive: true,
      extension: ".log",
      utc: true,
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: "./logs",
      filename: "exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: "30d",
      maxSize: "30m",
      zippedArchive: true,
      extension: ".log",
      utc: true,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      dirname: "./logs",
      filename: "rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: "30d",
      maxSize: "30m",
      zippedArchive: true,
      extension: ".log",
      utc: true,
    }),
  ],
});