import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";

const userRoutes = Router();

// apply auth middleware to all routes
userRoutes.use(protectRoute);

userRoutes.get("/", getRecommendedUsers);
userRoutes.get("/friends", getMyFriends);

export {userRoutes};