import express from "express";
import userRoutes from "./routes/users.route";
import authRoutes from "./routes/auth.route";
import eventRoutes from "./routes/event.route";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "./config/app_config";

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
export default app;
