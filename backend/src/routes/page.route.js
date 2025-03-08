import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getLikes, getLog, getLogs, getMoviePage, getHomePage, getReview, getReviews, getWatched, getWatchlist} from "../controllers/page.controller.js";
import { verifyUser } from "../middleware/user.middleware.js";

const router = express.Router();

// User-specific pages
router.get("/:username/likes", verifyUser, getLikes);
router.get("/:username/films", verifyUser, getWatched);
router.get("/:username/watchlist", verifyUser, getWatchlist);
router.get("/:username/diary", verifyUser, getLogs);
router.get("/:username/reviews", verifyUser, getReviews); 

// General
router.get("/:username/review/:reviewId", verifyUser, getReview);
router.get("/log", getLog);
router.get("/details/:movieName", getMoviePage);
router.get("/home", getHomePage);

export default router;