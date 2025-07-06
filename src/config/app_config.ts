import dotenv from "dotenv";
dotenv.config();

const appConfig = {
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_express_in: process.env.JWT_EXPIRES_IN,
  node_env: process.env.NODE_ENV as string,
};

export const corsOptions = {
  origin:
    appConfig.node_env === "development"
      ? "http://localhost:5173"
      : "https://likita-app.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  optionsSuccessStatus: 200,
};

export default appConfig;
