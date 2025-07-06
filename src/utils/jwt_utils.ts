import jwt from "jsonwebtoken";
import { JwtPayload, TokenPayload } from "../types/auth_types";

import type { Secret } from "jsonwebtoken";
import appConfig from "../config/app_config";

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, appConfig.jwt_secret);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, appConfig.jwt_secret) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
