import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appConfig from "../config/app_config";
import { IUser } from "../types/user";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ message: "User already exists", errorCode: "USER_EXISTS" });
    }

    const userWithName = await User.findOne({ username });
    if (userWithName) {
      return res.status(400).json({
        message: "Username already used",
        errorCode: "USERNAME_ALREADY_USED",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const record: IUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: record._id, email: record.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: appConfig.node_env === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "User created",
      data: {
        _id: record._id,
        username: record.username,
        email: record.email,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "un problème est survenu";

    return res.status(500).json({
      message,
      errorCode: "INTERNAL_SERVER",
    });
  }
};

export default {
  createUser,
};
