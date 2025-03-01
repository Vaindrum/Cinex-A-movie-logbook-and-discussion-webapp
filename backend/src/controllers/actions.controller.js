import Likes from "../models/likes.model.js";
import Rating from "../models/rating.model.js";
import Watched from "../models/watched.model.js";
import Watchlist from "../models/watchlist.model.js";
import Log from "../models/log.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";

export const toggleLike = async (req,res) => {
    try {
        const {movieId} = req;
        const userId = req.user.id;

        const existingLike = await Likes.findOne({userId, movieId});
        if(existingLike){
            await Likes.deleteOne({_id: existingLike._id});
            return res.status(200).json({message: "Like removed"});
        }

        const liked = await Likes.create({userId, movieId});

        res.status(200).json({message: "Movie liked", like: liked});
    } catch (error) {
        console.error("Error in toggleLike:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const toggleWatched = async (req,res) => {
    try {
        const {movieId} = req;
        const userId = req.user.id;
        
        const existingLog = await Log.findOne({userId,movieId});
        const existingRating = await Rating.findOne({userId,movieId});
        const existingReview = await Review.findOne({userId,movieId});
        if(existingLog || existingRating || existingReview){
            return res.status(400).json({message: "Cannot mark unwatched because there is some log or rating or review on this. Remove that first"});
        }
        
        const existingWatched = await Watched.findOne({userId,movieId});
        if(existingWatched){
            await Watched.deleteOne({_id: existingWatched._id});
            return res.status(200).json({message: "Removed from Watched"});
        }
        
        const markWatched = await Watched.create({userId,movieId});
        await Watchlist.deleteOne({userId, movieId});
        res.status(200).json({message: "Marked as Watched", watched: markWatched});
        
    } catch (error) {
        console.error("Error in toggleWatched:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const toggleWatchlist = async (req,res) => {
    try {
        const {movieId} = req;
        const userId = req.user.id;
        
        const existingWatchlist = await Watchlist.findOne({userId,movieId});
        if(existingWatchlist){
            await Watchlist.deleteOne({_id: existingWatchlist._id});
            return res.status(200).json({message: "Removed from Watchlist"});
        }
        
        const watchlisted = await Watchlist.create({userId,movieId});
        res.status(200).json({message: "Added to Watchlist", watchlist: watchlisted});
        
    } catch (error) {
        console.error("Error in toggleWatchlist:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const addOrUpdateRating = async (req,res) => {
    // if not attached to log, rating can be updated independently
    // since we only need one rating for one log(whether it be null or valid log), its ok to combine add and update into one function

    // but if attached to log, rating updated inside that log 
    // multiple logs -> multiple corresponding ratings if given 
    try {
        const {movieId} = req;
        const {rating} = req.body;
        const {logId} = req.body;
        const userId = req.user.id;
        
        if(typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating%0.5 !== 0){
            return res.status(400).json({message: "Invalid rating"});
        } 

        if(logId){
            const logExists = await Log.exists({_id:logId, userId, movieId});
            if(!logExists){
                return res.status(400).json({message: "Invalid log ID"});
            }
        }

        const newrating = await Rating.findOneAndUpdate(
            {userId,movieId,logId: logId || null},
            {rating},
            {upsert: true, new:true}
        );

        await Watched.findOneAndUpdate({userId,movieId},{},{upsert: true});
        await Watchlist.deleteOne({ userId, movieId });

        res.status(200).json({message: "Rating added or updated", rating: newrating});
    
    } catch (error) {
        console.error("Error in addOrUpdateRating:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const deleteRating = async (req,res) => {
    // rating deletion if independent -> delete independent rating (with logid: null)
    // rating deletion if in a log -> delete rating of that log (user wants to delete rating in that log)
    try {
        const {movieId} = req;
        const {logId} = req.body;
        const userId = req.user.id;

        if (logId) {
            const existingLogRating = await Rating.findOne({ userId, movieId, logId });
            if (!existingLogRating) {
                return res.status(400).json({ message: "No rating with that log to remove" });
            }
            await Rating.deleteOne({ userId, movieId, logId });
            return res.status(200).json({ message: "Rating deleted for log" });
        }

        const existingIndependentRating = await Rating.findOne({ userId, movieId, logId: null });
        if (!existingIndependentRating) {
            return res.status(400).json({ message: "No rating to remove" });
        }

        await Rating.deleteOne({userId,movieId,logId: null});
        return res.status(200).json({message: "Rating removed"});

    } catch (error) {
        console.error("Error in deleteRating:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const addReview = async (req,res) => {
    try {
        const {movieId} = req;
        const {logId,review,spoiler} = req.body;
        const userId = req.user.id;

        if(typeof review !== "string"){
            return res.status(400).json({message: "Invalid review"});
        }

        if(logId){
            const logExists = await Log.exists({_id:logId, userId, movieId});
            if(!logExists){
                return res.status(400).json({message: "Invalid log ID"});
            }

            const reviewExists = await Review.exists({logId});
            if(reviewExists){
                return res.status(400).json({message: "A review already exists for that log ID"});
            }
        }
        
        const createdReview = await Review.create({userId,movieId,review,spoiler,logId: logId || null});
        res.status(201).json({message: "Review added", review: createdReview});
        
    } catch (error) {
        console.error("Error in addReview:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateReview = async (req,res) => {
    try {
        const {movieId} = req;
        const {review,spoiler,reviewId} = req.body;
        const userId = req.user.id;
        
        if(typeof review !== "string"){
            return res.status(400).json({message: "Invalid review"});
        }

        if (review.trim() === "") {
            await Review.deleteOne({_id: reviewId,userId, movieId});
            return res.status(200).json({ message: "Review deleted" });
        }

        const updatedReview = await Review.findOneAndUpdate(
            {_id: reviewId,userId,movieId},
            {review,spoiler},
            {new: true}
        );
        if(!updatedReview) return res.status(404).json({message: "Review not found"});
        
        res.status(200).json({message: "Review Updated", review: updatedReview});

    } catch (error) {
        console.error("Error in updateReview:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const deleteReview = async (req,res) => {
    try {
        const {movieId} = req;
        const {reviewId} = req.body;
        const userId = req.user.id;
        
        const existingReview = await Review.findOne({_id: reviewId, userId, movieId});
        if(!existingReview){
            return res.status(404).json({message: "Review Not Found"});
        }

        await Review.deleteOne({_id: reviewId, userId, movieId});
        res.status(200).json({message: "Review deleted"});

    } catch (error) {
        console.error("Error in deleteReview:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const addLog = async (req,res) => {
    try {
        const {movieId} = req;
        const userId = req.user.id;
        const {watchedOn,rewatch} = req.body;

        if(watchedOn && isNaN(Date.parse(watchedOn))){
            return res.status(400).json({message: "Invalid date format for watchedOn"});
        }

        const createdLog = await Log.create({userId,movieId,rewatch,watchedOn: watchedOn || Date.now()});
        await Watched.findOneAndUpdate({userId, movieId},{},{upsert: true});
        await Watchlist.deleteOne({userId,movieId});

        res.status(201).json({message: "Log added", log: createdLog});

    } catch (error) {
        console.error("Error in addLog:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }    
};

export const updateLog = async (req,res) => {
    try {
        const {movieId} = req;
        const userId = req.user.id;
        const {logId,watchedOn,rewatch} = req.body;

        if(watchedOn && isNaN(Date.parse(watchedOn))){
            return res.status(400).json({message: "Invalid date format for watchedOn"});
        }

        const log = await Log.findOneAndUpdate(
            {userId,movieId,_id:logId},
            {watchedOn,rewatch},
            {new: true}
        );
        if(!log) return res.status(404).json({message: "Log not found"});

        res.status(200).json({message: "Log updated", log: log});

    } catch (error) {
        console.error("Error in updateLog:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

    // if rating attached to log, rating updated inside that log
    // if new log  and rating provided ok then create new 
    // if update to old log and rating provided then update related rating of that old log
    // if new log and rating not provided ok then copy latest independent rating to be shown to user as default for that log -> frontend
    // if old log update and rating not provided then give related rating of that old log not the latest

export const deleteLog = async (req,res) => {
    // deleting log -> delete referenced review and rating
    try {
        const {movieId} = req;
        const userId = req.user.id;
        const {logId} = req.body;

        const log = await Log.findOneAndDelete({userId,movieId,_id: logId});
        if(!log){
            return res.status(404).json({message: "Log not found"});
        }

        await Rating.deleteOne({userId,movieId,logId:log._id});
        await Review.deleteOne({userId,movieId,logId:log._id});

        res.status(200).json({message: "Log deleted"});

    } catch (error) {
        console.error("Error in deleteLog:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const addComment = async (req,res) => {
    try {
        const {reviewId, comment} = req.body;
        const userId = req.user.id;

        if(typeof comment !== "string" || comment.trim() === ""){
            return res.status(400).json({message: "Invalid Comment"});
        }

        const reviewExists = await Review.exists({_id: reviewId, userId});
        if(!reviewExists){
            return res.status(400).json({message: "Invalid review id"});
        }

        const createdComment = await Comment.create({userId,reviewId,comment});
        res.status(201).json({message: "Comment added", comment: createdComment});

    } catch (error) {
        console.error("Error in addComment:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const deleteComment = async (req,res) => {
    try {
        const {commentId} = req.body;
        const userId = req.user.id;

        const commentExists = await Comment.findOne({_id: commentId, userId});
        if(!commentExists){
            return res.status(404).json({message: "Comment Not Found"});
        }

        await Comment.deleteOne({_id: commentId, userId});
        res.status(200).json({message: "Comment Deleted"});

    } catch (error) {
        console.error("Error in deleteReview:",error.message);
        res.status(500).json({message: "Internal Server Error"});      
    }
};