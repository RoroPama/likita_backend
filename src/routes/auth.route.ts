import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/auth.controller";
import validate from "../middlewares/validators/validator";
import { loginSchema } from "../framework-core/validators/auth.schema";
const router = express.Router();

router.get("/checkAuth", (req, res, next) => {
  authController.checkIfAuthenticated(req, res, next);
});

router.post("/login", validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

export default router;
