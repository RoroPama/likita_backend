import dotenv from "dotenv";
dotenv.config();
const db_config = {
  mongoURI: process.env.MONGODB_URI,
};

export default db_config;
