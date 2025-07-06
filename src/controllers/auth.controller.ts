import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import appConfig, { cookieConfig } from "../config/app_config";
import { IUser } from "../types/user";
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser;

    if (!user) {
      return res.status(400).json({
        message: "L'utilisateur n'a pas été trouvé",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return res.status(401).json({
        message: "Mot de passe ou email incorrect",
        errorCode: "ID_INCORRECT",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieConfig);

    return res.status(200).json({
      message: "Connexion réussie",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Erreur de login :", error);
    return res
      .status(500)
      .json({ errorCode: "INTERNAL_SERVER", message: "Erreur serveur." });
  }
};

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const checkIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Token manquant. Accès refusé.",
        errorCode: "ACCESS_DENIED",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      message: "Utilisateur authentifié",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

export default {
  login,
  checkIfAuthenticated,
};
