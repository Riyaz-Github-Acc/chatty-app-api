import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import envConfig from "./config/env.config.js";
import { app, server } from "./config/socket.config.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatty-bot-app.netlify.app"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(envConfig.PORT, () => {
  console.log(`💻 Server started to run on the port: ${envConfig.PORT}`);
});
