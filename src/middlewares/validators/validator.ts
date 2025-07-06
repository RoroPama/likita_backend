// middlewares/validate.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

const validate = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error.errors);
      console.log(req.body);
      res.status(400).json({
        message: "Validation error",
        errors: result.error.errors,
        errorCode: "VALIDATION_ERROR",
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

export default validate;
