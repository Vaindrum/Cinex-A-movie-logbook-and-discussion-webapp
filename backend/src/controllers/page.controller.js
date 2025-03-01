import Likes from "../models/likes.model.js";
import Rating from "../models/rating.model.js";
import Watched from "../models/watched.model.js";
import Watchlist from "../models/watchlist.model.js";
import Log from "../models/log.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import { getMovieDetails } from "./movie.controller.js";

// FILMS PAGE
export const getWatched = async (req,res) => {
    try {
        const userId = req.user.id;
        const watchedMovies = await Watched.find({userId},{movieId:1,_id:0}).sort({_id:-1});

        // a list of movieId numbers that user has watched
        const movieIds = watchedMovies.map(m => m.movieId);

        // finding related ratings,reviews,likes
        const ratings = await Rating.find(
            {userId,movieId:{$in: movieIds}},
            {movieId:1, rating:1, _id:1}
        ).sort({_id:-1});
        
        const reviews = await Review.find(
            {userId,movieId:{$in: movieIds}},
            {movieId:1, _id:1}
        ).sort({_id:-1});

        const likes = await Likes.find(
            {userId, movieId: {$in: movieIds}},
            {movieId:1, _id:0}
        );

        // mapping those related ratings,reviews,likes to watched movieIDs
        const ratingMap = new Map();
        const reviewMap = new Map();

        ratings.forEach(r => {
            if(!ratingMap.has(r.movieId)) ratingMap.set(r.movieId, r.rating);
        });

        reviews.forEach(r => {
            if(!reviewMap.has(r.movieId)) reviewMap.set(r.movieId, r._id);
        });

        const likedMovies = new Set(likes.map(like=>like.movieId));

        // returning response data
        const watchedData = watchedMovies.map(movie => {
            const movieId = movie.movieId;
            return{
                movieId,
                rating: ratingMap.get(movieId) || null,
                reviewId: reviewMap.get(movieId) || null,
                liked: likedMovies.has(movieId) 
            }
        })

        res.status(200).json({watched: watchedData});
    } catch (error) {
        console.error("Error in getWatched", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// lIKES PAGE
export const getLikes = async (req,res) => {
    try {
        const userId = req.user.id;
        const likedMovies = await Likes.find({userId},{movieId:1,_id:0}).sort({_id:-1});

        const movieIds = likedMovies.map(m => m.movieId);


        const ratings = await Rating.find(
            {userId,movieId:{$in: movieIds}},
            {movieId:1, rating:1, _id:1}
        ).sort({_id:-1});
        
        const reviews = await Review.find(
            {userId,movieId:{$in: movieIds}},
            {movieId:1, _id:1}
        ).sort({_id:-1});

        const watched = await Watched.find(
            {userId, movieId: {$in: movieIds}},
            {movieId:1, _id:0}
        );


        const ratingMap = new Map();
        const reviewMap = new Map();

        ratings.forEach(r => {
            if(!ratingMap.has(r.movieId)) ratingMap.set(r.movieId, r.rating);
        });

        reviews.forEach(r => {
            if(!reviewMap.has(r.movieId)) reviewMap.set(r.movieId, r._id);
        });

        const watchedMovies = new Set(watched.map(watched=>watched.movieId));

        
        const likedData = likedMovies.map(movie => {
            const movieId = movie.movieId;
            return{
                movieId,
                rating: ratingMap.get(movieId) || null,
                reviewId: reviewMap.get(movieId) || null,
                watched: watchedMovies.has(movieId) 
            }
        })

        res.status(200).json({watched: likedData});
    } catch (error) {
        console.error("Error in getLikes", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}


// WATCHLIST PAGE
export const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const watchlistMovies = await Watchlist.find({ userId }, { movieId: 1, _id: 0 }).sort({ _id: -1 });
        
        res.status(200).json({ watchlist: watchlistMovies });
    } catch (error) {
        console.error("Error in getWatchlist:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DIARY PAGE
export const getLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const logs = await Log.find({ userId }).sort({ _id: -1 });

        const logIds = logs.map(log => log._id);


        const ratings = await Rating.find(
            {userId,logId:{$in: logIds}},
            {logId:1, rating:1, _id:1}
        );
        
        const reviews = await Review.find(
            {userId,logId:{$in: logIds}},
            {logId:1, _id:1}
        );

        const likes = await Likes.find(
            {userId, movieId: {$in: logs.map(log => log.movieId)}},
            {movieId:1, _id:0}
        );

        // console.log("logIds:", logIds);
        // console.log("Ratings:", ratings);
        // console.log("Reviews:", reviews);

        const ratingMap = new Map(ratings.map(r => [r.logId.toString(), r.rating]));

        const reviewMap = new Map(reviews.map(r => [r.logId.toString(), r._id]));

        const likedMovies = new Set(likes.map(like=>like.movieId));

        
        const logsData = logs.map(log => {
            return{
                logId: log._id,
                movieId: log.movieId,
                watchedOn: log.watchedOn,
                rewatch: log.rewatch,
                rating: ratingMap.get(log._id.toString()) || null,
                reviewId: reviewMap.get(log._id.toString()) || null,
                liked: likedMovies.has(log.movieId) 
            }
        })

        res.status(200).json({ logsData });
    } catch (error) {
        console.error("Error in getLogs:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// REVIEWS PAGE
export const getReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.find({ userId }).sort({ _id: -1 });

        const logIds = reviews.map(review => review.logId).filter(logId => logId);
        const movieIds = reviews.map(review => review.movieId);


        const logs = await Log.find(
            {_id: {$in: logIds}},
            {_id:1, watchedOn:1, rewatch:1}
        );

        const ratings = await Rating.find(
            {userId, $or: [
                {logId: {$in: logIds}},
                {logId: null, movieId: {$in: movieIds}}]},
            {logId:1, rating:1, _id:1}
        );

        const likes = await Likes.find(
            {userId, movieId: {$in: movieIds}},
            {movieId:1, _id:0}
        );

        const logMap = new Map(logs.map(log => [log._id.toString(), {watchedOn: log.watchedOn, rewatch: log.rewatch}]));

        const ratingMap = new Map(ratings.map(r => [(r.logId ? r.logId.toString() : r.movieId.toString()), r.rating]));

        const likedMovies = new Set(likes.map(like=>like.movieId));

        
        const reviewsData = reviews.map(review => {
            const logDetails = logMap.get(review.logId?.toString()) || {};
            return{
                reviewId: review._id,
                movieId: review.movieId,
                review: review.review,
                spoiler: review.spoiler, 
                createdAt: review.createdAt,
                watchedOn: logDetails.watchedOn,
                rewatch: logDetails.rewatch,
                rating: ratingMap.get(review.logId?.toString()) || ratingMap.get(review?.movieId?.toString()) || null,
                liked: likedMovies.has(review.movieId) 
            }
        })

        res.status(200).json({ reviewsData });
        
    } catch (error) {
        console.error("Error in getReviews:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// INDIVIDUAL LOG
export const getLog = async (req, res) => {
    try {
        const {logId} = req.body;
        const log = await Log.findById(logId);
        if(!log) return res.status(404).json({message: "Log Not Found"});

        const rating = await Rating.findOne({logId},{rating:1,_id:0});
        const review = await Review.findOne({logId},{review:1,spoiler:1,_id:1});
        const liked = await Likes.exists({userId: log.userId, movieId: log.movieId});
        const comments = review ? await Comment.find({reviewId: review._id}) : [];

        res.json({
            logId: log._id,
            movieId: log.movieId,
            watchedOn: log.watchedOn,
            rewatch: log.rewatch,
            rating: rating?.rating || null,
            review: review || null,
            liked: !!liked,
            comments
        })

    } catch (error) {
        console.log("Error in getLog", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};


// INDIVIDUAL REVIEW
export const getReview = async (req,res) => {
    try {
        const {reviewId} = req.body;
        const review = await Review.findById(reviewId);
        if(!review) return res.status(404).json({message: "Review Not Found"});

        const log = await Log.findById(review.logId, {watchedOn:1,rewatch:1});
        
        const rating = await Rating.findOne({
            $or: [
                {logId: review.logId},
                {logId: null, movieId: review.movieId}
            ]
        }, {rating:1, _id:0});
        
        const liked = await Likes.exists({userId: review.userId,movieId: review.movieId}); 
        const comments = await Comment.find({reviewId});

        res.json({
            reviewId: review._id,
            movieId: review.movieId,
            review: review.review,
            spoiler: review.spoiler,
            logId: log?.log._id || null,
            watchedOn: log?.log.watchedOn || review.createdAt,
            rewatch: log?.log.rewatch || false,
            rating: rating?.rating || null,
            liked: !!liked,
            comments
        })

    } catch (error) {
        console.error("Error in getReview", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};


// INDIVIDUAL MOVIE PAGE
export const getMoviePage = async (req,res) => {
    try {
        const {movieId} = req.params;
        const movieDetails = await getMovieDetails(movieId);
        const reviews = await Review.find({movieId}).sort({_id:-1});

        const ratings = await Rating.find({movieId},{logId:1,movieId:1,rating:1,_id:0});
        const likes = await Likes.find({movieId},{userId:1,_id:0});

        const ratingMap = new Map(ratings.map(r => [
            (r.logId ? r.logId.toString() : r.movieId.toString(), r.rating)
        ]));

        const likesMap = new Set(likes.map(like => like.userId.toString()));

        const reviewsData = reviews.map(review => ({
            reviewId: review._id,
            userId: review.userId,
            review: review.review,
            spoiler: review.spoiler,
            liked: likesMap.has(review.userId.toString()),
            rating: ratingMap.get(review.logId?.toString()) || ratingMap.get(review.movieId.toString()) || null
        }));

        res.json({movieDetails, reviewsData })

    } catch (error) {
        console.error("Error in getMoviePage", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}