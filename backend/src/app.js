import express from "express";
import { authRoutes } from "./routes/auth.route.js";
import {userRoutes} from './routes/user.route.js';
import { chatRoutes } from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/chat", chatRoutes)
export default app;