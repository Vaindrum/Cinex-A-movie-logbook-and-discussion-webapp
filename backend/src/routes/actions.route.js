import express from "express";
import { toggleLike, toggleWatched, toggleWatchlist, addOrUpdateRating } from "../controllers/actions.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/like/:movieId", protectRoute, toggleLike);
router.post("/rate/:movieId", protectRoute, addOrUpdateRating);
router.post("/watched/:movieId", protectRoute, toggleWatched);
router.post("/watchlist/:movieId", protectRoute, toggleWatchlist);

export default router;