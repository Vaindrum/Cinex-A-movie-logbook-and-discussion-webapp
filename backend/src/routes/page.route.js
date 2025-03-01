import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getLikes, getLog, getLogs, getMoviePage, getReview, getReviews, getWatched, getWatchlist} from "../controllers/page.controller.js";
import { validateMovie } from "../middleware/movie.middleware.js";

const router = express.Router();

// User-specific pages
router.get("/likes", protectRoute, getLikes);
router.get("/films", protectRoute, getWatched);
router.get("/watchlist", protectRoute, getWatchlist);
router.get("/diary",protectRoute, getLogs);
router.get("/reviews", protectRoute, getReviews); 

// General
router.get("/review", getReview);
router.get("/log", getLog);
router.get("/details/:movieId", validateMovie, getMoviePage);

export default router;