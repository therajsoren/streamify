import { Router } from "express";
import protectRoute from '../middleware/auth.middleware.js'
const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

authRoutes.post("/onboarding", protectRoute, onboard);

export {authRoutes};