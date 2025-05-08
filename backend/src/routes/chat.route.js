import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getStreamToken } from "../controllers/chat.controller.js";

const chatRoutes = Router();

chatRoutes.get("/token", protectRoute, getStreamToken);

export {chatRoutes};