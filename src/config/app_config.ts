import dotenv from "dotenv";
dotenv.config();

export const corsOptions = {
  origin: "https://likita-app.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  optionsSuccessStatus: 200,
};

const appConfig = {
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_express_in: process.env.JWT_EXPIRES_IN,
  node_env: process.env.NODE_ENV as string,
};

export default appConfig;
