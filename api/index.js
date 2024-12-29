// npm i imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { mongoConnect } from "./config/mongodb.config.js";
import redis from "./cache/redis.cache.js";

// file imports
import authRoutes from "./routes/user.route.js";

// configurations
dotenv.config();
const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);

// server listening
const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoConnect();
  redis;
});
