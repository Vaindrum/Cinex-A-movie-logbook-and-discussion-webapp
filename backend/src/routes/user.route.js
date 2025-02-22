import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { followUser, unfollowUser, getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/follow/:id", protectRoute, followUser);
router.put("/unfollow/:id", protectRoute, unfollowUser);
router.get("/:id", protectRoute, getUserProfile);

export default router;