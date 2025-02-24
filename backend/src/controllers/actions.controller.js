import { fetchFromTMDB } from "../lib/tmdb.js"; 
import Likes from "../models/likes.model.js";
import Rating from "../models/rating.model.js";
import Watched from "../models/watched.model.js";
import Watchlist from "../models/watchlist.model.js";

export const toggleLike = async (req,res) => {
    try {
        const movieId = Number(req.params.movieId);
        const userId = req.user.id;

        if(isNaN(movieId) || movieId < 0){
            return res.status(400).json({message: "Invalid Movie ID"});
        }

        const movie = await fetchFromTMDB(`movie/${movieId}`);
        if(!movie || movie.status_code===34){
            return res.status(404).json({message: "Movie Not Found"})
        }

        const existingLike = await Likes.findOne({userId, movieId});
        if(existingLike){
            await Likes.deleteOne({_id: existingLike._id});
            return res.status(200).json({message: "Like removed"});
        }
        await Likes.create({userId, movieId});

        // can like a movie without watching it
        // const WatchedExists = await Watched.findOne({userId, movieId});
        // if(!WatchedExists){
        //     await Watched.create({userId,movieId});
        // }

        res.status(200).json({message: "Movie liked"});
    } catch (error) {
        console.error("Error in toggleLike:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const addOrUpdateRating = async (req,res) => {
    try {
        const movieId = Number(req.params.movieId);
        const {rating} = req.body;
        const userId = req.user.id;

        if(isNaN(movieId) || movieId < 0){
            return res.status(400).json({message: "Invalid Movie ID"});
        }
        
        const movie = await fetchFromTMDB(`movie/${movieId}`);
        if(!movie || movie.status_code===34){
            return res.status(404).json({message: "Movie Not Found"})
        }

        
        let existingRating = await Rating.findOne({userId, movieId});
        
        if(rating === null){
            if(existingRating){
                await existingRating.deleteOne();
                return res.status(200).json({message: "Rating removed"});
            }
            return res.status(400).json({message: "No rating to remove"});
        }
        
        if(rating !== null && (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating%0.5 !== 0)){
            return res.status(400).json({message: "Invalid rating"});
        } 

        if(existingRating){
            existingRating.rating = rating;
            await existingRating.save();
            // returns update and thus, skips watchlist deletion
            // i allow movies to be watchlisted even if they are marked watched cause the user might want to rewatch that
            // upon rewatch if he updates rating that means rewatch is done and remove from watchlist
            // return res.status(200).json({message: "Rating updated"});
        } else{
            await Rating.create({userId,movieId,rating});
        }


        let watched = await Watched.findOne({userId,movieId});
        if(!watched){
            await Watched.create({userId,movieId});
        }

        await Watchlist.deleteOne({ userId, movieId });

        res.status(200).json({message: "Rating added"});
    
    } catch (error) {
        console.error("Error in addOrUpdateRating:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const toggleWatched = async (req,res) => {
    try {
        const movieId = Number(req.params.movieId);
        const userId = req.user.id;

        if(isNaN(movieId) || movieId < 0){
            return res.status(400).json({message: "Invalid Movie ID"});
        }

        const movie = await fetchFromTMDB(`movie/${movieId}`);
        if(!movie || movie.status_code===34){
            return res.status(404).json({message: "Movie Not Found"})
        }

        const existingRating = await Rating.findOne({userId,movieId});
        if(existingRating){
            return res.status(400).json({message: "Cannot unwatch a movie with a rating. Remove the rating first"});
        }

        const existingWatched = await Watched.findOne({userId,movieId});
        if(existingWatched){
            await Watched.deleteOne({_id: existingWatched._id});
            return res.status(200).json({message: "Removed from Watched"});
        }
        
        await Watched.create({userId,movieId});
        await Watchlist.deleteOne({userId, movieId});
        res.status(200).json({message: "Marked as Watched"});

    } catch (error) {
        console.error("Error in toggleWatched:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const toggleWatchlist = async (req,res) => {
    try {
        const movieId = Number(req.params.movieId);
        const userId = req.user.id;

        if(isNaN(movieId) || movieId < 0){
            return res.status(400).json({message: "Invalid Movie ID"});
        }

        const movie = await fetchFromTMDB(`movie/${movieId}`);
        if(!movie || movie.status_code===34){
            return res.status(404).json({message: "Movie Not Found"})
        }

        const existingWatchlist = await Watchlist.findOne({userId,movieId});
        if(existingWatchlist){
            await Watchlist.deleteOne({_id: existingWatchlist._id});
            return res.status(200).json({message: "Removed from Watchlist"});
        }
        await Watchlist.create({userId,movieId});
        res.status(200).json({message: "Added to Watchlist"});
    } catch (error) {
        console.error("Error in toggleWatchlist:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}