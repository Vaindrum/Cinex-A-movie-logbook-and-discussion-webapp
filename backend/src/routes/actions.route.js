import express from "express";
import { toggleLike, toggleWatched, toggleWatchlist, addOrUpdateRating, deleteRating, addReview, updateReview, deleteReview, addLog, updateLog, deleteLog, addComment, deleteComment, getActions } from "../controllers/actions.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateMovie } from "../middleware/movie.middleware.js";
import { verifyUser } from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/like/:movieId", protectRoute, validateMovie, toggleLike);
router.post("/watched/:movieId", protectRoute, validateMovie, toggleWatched);
router.post("/watchlist/:movieId", protectRoute, validateMovie, toggleWatchlist);

router.post("/rate/:movieId", protectRoute, validateMovie, addOrUpdateRating);
router.delete("/rate/:movieId", protectRoute, validateMovie, deleteRating);

router.post("/review/:movieId", protectRoute, validateMovie, addReview);
router.put("/review/:movieId", protectRoute, validateMovie, updateReview);
router.delete("/review/:movieId", protectRoute, validateMovie, deleteReview);

router.post("/log/:movieId", protectRoute, validateMovie, addLog);
router.put("/log/:movieId", protectRoute, validateMovie, updateLog);
router.delete("/log/:movieId", protectRoute, validateMovie, deleteLog);

router.post("/comment", protectRoute, addComment);
router.delete("/comment", protectRoute, deleteComment);

router.get("/:username/:movieId", verifyUser, getActions);


export default router;