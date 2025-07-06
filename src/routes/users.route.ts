import express, { Request, Response, NextFunction } from "express";
import usersController from "../controllers/users.controller";
import { createUserSchema } from "../framework-core/validators/user.schema";
import validate from "../middlewares/validators/validator";
const router = express.Router();

router.post("/", validate(createUserSchema), (req, res, next) => {
  usersController.createUser(req, res, next);
});

export default router;
