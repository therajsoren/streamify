import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getRecommendedUsers, getMyFriends, sendFriendRequest } from "../controllers/user.controller.js";
const userRoutes = Router();

// apply auth middleware to all routes
userRoutes.use(protectRoute);

userRoutes.get("/", getRecommendedUsers);
userRoutes.get("/friends", getMyFriends);

userRoutes.post("/friend-request/:id", sendFriendRequest);

export {userRoutes};