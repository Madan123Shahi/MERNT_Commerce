import jwt from "jsonwebtoken";
import { promisify } from "util";
import { ConfigError, ConfigP } from "../errors/CustomErrors";
import { logger } from "./Logger";

export const token = (payload: object) => {
  if (!process.env.JWT_SECRET) {
    logger.error(`JWT Secret is not configured`, 500);
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};
