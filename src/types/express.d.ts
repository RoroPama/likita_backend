// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      cookies: {
        token?: string;
        [key: string]: any;
      };
    }
  }
}

export {};
