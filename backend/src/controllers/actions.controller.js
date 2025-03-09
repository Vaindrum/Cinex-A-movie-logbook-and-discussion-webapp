import Likes from "../models/likes.model.js";
import Rating from "../models/rating.model.js";
import Watched from "../models/watched.model.js";
import Watchlist from "../models/watchlist.model.js";
import Log from "../models/log.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import { getMovieDetails } from "./movie.controller.js";

export const toggleLike = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;

        const existingLike = await Likes.findOne({ userId, movieId });
        if (existingLike) {
            await Likes.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: "Like removed" });
        }

        const liked = await Likes.create({ userId, movieId });

        res.status(200).json({ message: "Movie liked", like: liked });
    } catch (error) {
        console.error("Error in toggleLike:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleWatched = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;

        const existingLog = await Log.findOne({ userId, movieId });
        const existingRating = await Rating.findOne({ userId, movieId });
        const existingReview = await Review.findOne({ userId, movieId });
        if (existingLog || existingRating || existingReview) {
            return res.status(400).json({ message: "Cannot mark unwatched because there is some log or rating or review on this. Remove that first" });
        }

        const existingWatched = await Watched.findOne({ userId, movieId });
        if (existingWatched) {
            await Watched.deleteOne({ _id: existingWatched._id });
            return res.status(200).json({ message: "Removed from Watched" });
        }

        const markWatched = await Watched.create({ userId, movieId });
        await Watchlist.deleteOne({ userId, movieId });
        res.status(200).json({ message: "Marked as Watched", watched: markWatched });

    } catch (error) {
        console.error("Error in toggleWatched:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleWatchlist = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;

        const existingWatchlist = await Watchlist.findOne({ userId, movieId });
        if (existingWatchlist) {
            await Watchlist.deleteOne({ _id: existingWatchlist._id });
            return res.status(200).json({ message: "Removed from Watchlist" });
        }

        const watchlisted = await Watchlist.create({ userId, movieId });
        res.status(200).json({ message: "Added to Watchlist", watchlist: watchlisted });

    } catch (error) {
        console.error("Error in toggleWatchlist:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addOrUpdateRating = async (req, res) => {
    try {
        const { movieId } = req;
        const { rating } = req.body;
        const userId = req.user.id;

        if (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0) {
            return res.status(400).json({ message: "Invalid rating" });
        }

        const newrating = await Rating.findOneAndUpdate(
            { userId, movieId, logId: null },
            { rating },
            { upsert: true, new: true }
        );

        await Watched.findOneAndUpdate({ userId, movieId }, {}, { upsert: true });
        await Watchlist.deleteOne({ userId, movieId });

        res.status(200).json({ message: "Rating added or updated", rating: newrating });

    } catch (error) {
        console.error("Error in addOrUpdateRating:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteRating = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;

        const existingIndependentRating = await Rating.findOne({ userId, movieId, logId: null });
        if (!existingIndependentRating) {
            return res.status(400).json({ message: "No rating to remove" });
        }

        await Rating.deleteOne({ userId, movieId, logId: null });
        return res.status(200).json({ message: "Rating removed" });

    } catch (error) {
        console.error("Error in deleteRating:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addReview = async (req, res) => {
    try {
        const { movieId } = req;
        const { review, spoiler, rating, liked } = req.body;
        const userId = req.user.id;
        console.log(movieId, review, spoiler, rating, liked);

        if (typeof review !== "string" || review.trim().length === 0) {
            return res.status(400).json({ message: "Review cannot be empty" });
        }

        const createdReview = await Review.create({ userId, movieId, review, spoiler });

        let newrating = null;
        if (rating !== undefined && rating !== null) {
            if (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0) {
                return res.status(400).json({ message: "Invalid rating" });
            }
            newrating = await Rating.findOneAndUpdate(
                { userId, movieId, logId: null },
                { rating },
                { upsert: true, new: true }
            );
            await Watched.findOneAndUpdate({ userId, movieId }, {}, { upsert: true });
        }

        let likeStatus = null;
        if (liked !== undefined) {
            const existingLike = await Likes.findOne({ userId, movieId });

            if (liked && !existingLike) {
                await Likes.create({ userId, movieId });
                likeStatus = true;
            } else if (!liked && existingLike) {
                await Likes.deleteOne({ _id: existingLike._id });
                likeStatus = false;
            }
        }

        await Watchlist.deleteOne({ userId, movieId });
        res.status(201).json({ message: "Review added", review: createdReview, rating: newrating, like: likeStatus });

    } catch (error) {
        console.error("Error in addReview:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { movieId } = req;
        const { review, spoiler, reviewId, rating, liked } = req.body;
        const userId = req.user.id;
        console.log(movieId, review, spoiler, rating, liked);


        if (typeof review !== "string") {
            return res.status(400).json({ message: "Invalid review" });
        }

        if (review.trim() === "") {
            await Review.deleteOne({ _id: reviewId, userId, movieId });
            // return res.status(200).json({ message: "Review deleted" });
        }

        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, userId, movieId },
            { review, spoiler },
            { new: true }
        );
        if (!updatedReview) return res.status(404).json({ message: "Review not found" });

        let newrating = null;
        if (rating !== undefined) {
            if (rating === null) {
                await Rating.deleteOne({ userId, movieId, logId: null });
            } else {
                if (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0) {
                    return res.status(400).json({ message: "Invalid rating" });
                }
                newrating = await Rating.findOneAndUpdate(
                    { userId, movieId, logId: null },
                    { rating },
                    { upsert: true, new: true }
                );
                await Watched.findOneAndUpdate({ userId, movieId }, {}, { upsert: true });
            }
        }

        let likeStatus = null;
        if (liked !== undefined) {
            const existingLike = await Likes.findOne({ userId, movieId });

            if (liked && !existingLike) {
                await Likes.create({ userId, movieId });
                likeStatus = true;
            } else if (!liked && existingLike) {
                await Likes.deleteOne({ _id: existingLike._id });
                likeStatus = false;
            }
        }

        res.status(201).json({ message: "Review updated", review: updatedReview, rating: newrating, like: likeStatus });

    } catch (error) {
        console.error("Error in updateReview:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { movieId } = req;
        const { reviewId } = req.body;
        const userId = req.user.id;

        const existingReview = await Review.findOne({ _id: reviewId, userId, movieId });
        if (!existingReview) {
            return res.status(404).json({ message: "Review Not Found" });
        }

        await Review.deleteOne({ _id: reviewId, userId, movieId });
        res.status(200).json({ message: "Review deleted" });

    } catch (error) {
        console.error("Error in deleteReview:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addLog = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;
        const { rating, liked, review, watchedOn, rewatch, spoiler } = req.body;
        console.log(movieId, review, spoiler, rating, liked, watchedOn, rewatch);

        if (watchedOn && isNaN(Date.parse(watchedOn))) {
            return res.status(400).json({ message: "Invalid date format for watchedOn" });
        }

        const createdLog = await Log.create({ userId, movieId, rewatch, watchedOn: watchedOn || Date.now() });

        let createdReview = null;
        if (review && typeof review === "string" && review.trim().length > 0) {
            createdReview = await Review.create({ userId, movieId, review, spoiler, logId: createdLog._id });
        }

        let newrating = null;
        if (rating !== undefined && rating !== null) {
            if (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0) {
                return res.status(400).json({ message: "Invalid rating" });
            }
            newrating = await Rating.create({ userId, movieId, logId: createdLog._id, rating });
        }

        let likeStatus = null;
        if (liked !== undefined) {
            const existingLike = await Likes.findOne({ userId, movieId });

            if (liked && !existingLike) {
                await Likes.create({ userId, movieId });
                likeStatus = true;
            } else if (!liked && existingLike) {
                await Likes.deleteOne({ _id: existingLike._id });
                likeStatus = false;
            }
        }

        await Watched.findOneAndUpdate({ userId, movieId }, {}, { upsert: true });
        await Watchlist.deleteOne({ userId, movieId });
        res.status(201).json({ message: "Log added", log: createdLog, review: createdReview, rating: newrating, like: likeStatus });

    } catch (error) {
        console.error("Error in addLog:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateLog = async (req, res) => {
    try {
        const { movieId } = req;
        const userId = req.user.id;
        const { logId, spoiler, watchedOn, rewatch, review, rating, liked } = req.body;
        console.log(movieId, review, spoiler, rating, liked, watchedOn, rewatch, logId);

        if (watchedOn && isNaN(Date.parse(watchedOn))) {
            return res.status(400).json({ message: "Invalid date format for watchedOn" });
        }

        const log = await Log.findOneAndUpdate(
            { userId, movieId, _id: logId },
            { watchedOn, rewatch },
            { new: true }
        );
        if (!log) return res.status(404).json({ message: "Log not found" });

        let updatedReview = null;
        if (typeof review === "string") {
            if (review.trim() === "") {
                await Review.deleteOne({ logId, userId, movieId });
            } else {
                updatedReview = await Review.findOneAndUpdate(
                    { logId, userId, movieId },
                    { review, spoiler },
                    { new: true, upsert: true }
                );
            }
        }
        // if (!updatedReview) return res.status(404).json({ message: "Review not found" });


        let newrating = null;
        if (rating !== undefined) {
            if (rating === null) {
                await Rating.deleteOne({ userId, movieId, logId });
            } else {
                if (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0) {
                    return res.status(400).json({ message: "Invalid rating" });
                }
                newrating = await Rating.findOneAndUpdate(
                    { userId, movieId, logId },
                    { rating },
                    { upsert: true, new: true }
                );
            }
        }

        let likeStatus = null;
        if (liked !== undefined) {
            const existingLike = await Likes.findOne({ userId, movieId });

            if (liked && !existingLike) {
                await Likes.create({ userId, movieId });
                likeStatus = true;
            } else if (!liked && existingLike) {
                await Likes.deleteOne({ _id: existingLike._id });
                likeStatus = false;
            }
        }

        await Watched.findOneAndUpdate({ userId, movieId }, {}, { upsert: true });
        await Watchlist.deleteOne({ userId, movieId });
        res.status(200).json({ message: "Log updated", log: log, review: updatedReview, rating: newrating, like: likeStatus });

    } catch (error) {
        console.error("Error in updateLog:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// if rating attached to log, rating updated inside that log
// if new log  and rating provided ok then create new 
// if update to old log and rating provided then update related rating of that old log
// if new log and rating not provided ok then copy latest independent rating to be shown to user as default for that log -> frontend
// if old log update and rating not provided then give related rating of that old log not the latest

export const deleteLog = async (req, res) => {
    // deleting log -> delete referenced review and rating
    try {
        const { movieId } = req;
        const userId = req.user.id;
        const { logId } = req.body;

        const log = await Log.findOneAndDelete({ userId, movieId, _id: logId });
        if (!log) {
            return res.status(404).json({ message: "Log not found" });
        }

        await Rating.deleteOne({ userId, movieId, logId });
        await Review.deleteOne({ userId, movieId, logId });

        res.status(200).json({ message: "Log deleted" });

    } catch (error) {
        console.error("Error in deleteLog:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { reviewId, comment } = req.body;
        const userId = req.user.id;
        console.log(userId);

        if (typeof comment !== "string" || comment.trim() === "") {
            return res.status(400).json({ message: "Invalid Comment" });
        }

        const reviewExists = await Review.exists({ _id: reviewId });
        if (!reviewExists) {
            return res.status(400).json({ message: "Invalid review id" });
        }

        const createdComment = await Comment.create({ userId, reviewId, comment });
        res.status(201).json({ message: "Comment added", comment: createdComment });

    } catch (error) {
        console.error("Error in addComment:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;

        const commentExists = await Comment.findOne({ _id: commentId, userId });
        if (!commentExists) {
            return res.status(404).json({ message: "Comment Not Found" });
        }

        await Comment.deleteOne({ _id: commentId, userId });
        res.status(200).json({ message: "Comment Deleted" });

    } catch (error) {
        console.error("Error in deleteReview:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getActions = async (req, res) => {
    try {
        const userId = req.userId;
        const { movieId } = req.params;

        const [watched, log, liked, watchlisted, rating, review] = await Promise.all([
            Watched.exists({ userId, movieId }),
            Log.exists({ userId, movieId }),
            Likes.exists({ userId, movieId }),
            Watchlist.exists({ userId, movieId }),
            Rating.findOne({ userId, movieId }, { rating: 1, _id: 0 }).sort({ updatedAt: -1 }), ,
            Review.exists({ userId, movieId })
        ]);

        res.status(200).json({
            watched: !!watched,
            liked: !!liked,
            watchlisted: !!watchlisted,
            rating: rating ? rating.rating : null,
            reviewed: !!review,
            logged: !!log
        });

    } catch (error) {
        console.error("Error in getActions:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
