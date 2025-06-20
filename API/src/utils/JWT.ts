import jwt, { SignOptions } from "jsonwebtoken";
import { promisify } from "util";
import { ConfigError, ConfigP } from "../errors/CustomErrors";
import { logger } from "./Logger";

export const token = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = parseInt(process.env.JWT_EXPIRES_IN) || "90d";
  if (!secret) {
    logger.error(`JWT Secret is not configured`, 500);
  }
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = async (token: string) => {
  const verifyAsync = promisify(jwt.verify);
  return await verifyAsync.call(jwt, token, process.env.SECRET);
};
