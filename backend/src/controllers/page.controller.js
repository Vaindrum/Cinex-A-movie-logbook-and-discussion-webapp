import Likes from "../models/likes.model.js";
import Rating from "../models/rating.model.js";
import Watched from "../models/watched.model.js";
import Watchlist from "../models/watchlist.model.js";
import Log from "../models/log.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import Movie from "../models/movie.model.js";
import { getMovieCache, getMovieDetails } from "./movie.controller.js";
import { fetchFromTMDB } from "../lib/tmdb.js";

// FILMS PAGE
export const getWatched = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;

        const page = parseInt(req.query.page) || 1;
        const limit = 40;
        const skip = (page - 1) * limit;
        const totalMovies = await Watched.countDocuments({ userId });

        const watchedMovies = await Watched.find({ userId }, { movieId: 1, _id: 0 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);


        const movieIds = watchedMovies.map(m => m.movieId);

        // finding ratings,reviews,likes related to movies that are WATCHED
        const ratings = await Rating.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, rating: 1, _id: 1 }
        ).sort({ updatedAt: -1 });

        const reviews = await Review.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, _id: 1 }
        ).sort({ _id: -1 });

        const likes = await Likes.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, _id: 0 }
        );

        // mapping those related ratings,reviews,likes and cache info to watched movieIDs
        const ratingMap = new Map();
        const reviewMap = new Map();

        ratings.forEach(r => {
            if (!ratingMap.has(r.movieId)) ratingMap.set(r.movieId, r.rating);
        });

        reviews.forEach(r => {
            if (!reviewMap.has(r.movieId)) reviewMap.set(r.movieId, r._id);
        });

        const likedMovies = new Set(likes.map(like => like.movieId));

        const movieMap = await getMovieCache(movieIds);


        const watchedData = watchedMovies.map(movie => {
            const movieId = movie.movieId;
            const cache = movieMap.get(movieId) || { title: null, poster_path: null, release_date: null };
            return {
                movieId,
                poster_path: cache.poster_path,
                title: cache.title,
                release_date: cache.release_date,
                rating: ratingMap.get(movieId) || null,
                reviewId: reviewMap.get(movieId) || null,
                liked: likedMovies.has(movieId),
            }
        }).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        res.status(200).json({ profilePic, totalMovies: totalMovies, watched: watchedData });
    } catch (error) {
        console.error("Error in getWatched", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// lIKES PAGE
export const getLikes = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;

        const page = parseInt(req.query.page) || 1;
        const limit = 40;
        const skip = (page - 1) * limit;
        const totalMovies = await Likes.countDocuments({ userId });

        const likedMovies = await Likes.find({ userId }, { movieId: 1, _id: 0 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);;

        const movieIds = likedMovies.map(m => m.movieId);


        const ratings = await Rating.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, rating: 1, _id: 1 }
        ).sort({ updatedAt: -1 });

        const reviews = await Review.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, _id: 1 }
        ).sort({ _id: -1 });

        const watched = await Watched.find(
            { userId, movieId: { $in: movieIds } },
            { movieId: 1, _id: 0 }
        );


        const ratingMap = new Map();
        const reviewMap = new Map();

        ratings.forEach(r => {
            if (!ratingMap.has(r.movieId)) ratingMap.set(r.movieId, r.rating);
        });

        reviews.forEach(r => {
            if (!reviewMap.has(r.movieId)) reviewMap.set(r.movieId, r._id);
        });

        const watchedMovies = new Set(watched.map(watched => watched.movieId));

        const movieMap = await getMovieCache(movieIds);

        const likedData = likedMovies.map(movie => {
            const movieId = movie.movieId;
            const cache = movieMap.get(movieId) || { title: null, poster_path: null, release_date: null };
            return {
                movieId,
                poster_path: cache.poster_path,
                title: cache.title,
                release_date: cache.release_date,
                rating: ratingMap.get(movieId) || null,
                reviewId: reviewMap.get(movieId) || null,
                watched: watchedMovies.has(movieId)
            }
        }).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        res.status(200).json({ profilePic, totalMovies: totalMovies, liked: likedData });
    } catch (error) {
        console.error("Error in getLikes", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// WATCHLIST PAGE
export const getWatchlist = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;

        const page = parseInt(req.query.page) || 1;
        const limit = 40;
        const skip = (page - 1) * limit;
        const totalMovies = await Watchlist.countDocuments({ userId });

        const watchlistMovies = await Watchlist.find({ userId }, { movieId: 1, createdAt: 1, _id: 0 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);;

        const movieIds = watchlistMovies.map(m => m.movieId);
        const movieMap = await getMovieCache(movieIds);

        const watchlistData = watchlistMovies.map(movie => {
            const movieId = movie.movieId;
            const cache = movieMap.get(movieId) || { title: null, poster_path: null, release_date: null };
            return {
                movieId,
                poster_path: cache.poster_path,
                title: cache.title,
                release_date: cache.release_date,
            }
        })

        res.status(200).json({ profilePic,totalMovies: totalMovies, watchlist: watchlistData });
    } catch (error) {
        console.error("Error in getWatchlist:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DIARY PAGE
export const getLogs = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const totalLogs = await Log.countDocuments({ userId });

        const logs = await Log.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const logIds = logs.map(log => log._id);
        const movieIds = logs.map(log => log.movieId);

        const ratings = await Rating.find(
            { userId, logId: { $in: logIds } },
            { logId: 1, rating: 1, _id: 1 }
        );

        const reviews = await Review.find(
            { userId, logId: { $in: logIds } },
            { logId: 1, _id: 1, review:1 }
        );

        const likes = await Likes.find(
            { userId, movieId: { $in: logs.map(log => log.movieId) } },
            { movieId: 1, _id: 0 }
        );

        // console.log("logIds:", logIds);
        // console.log("Ratings:", ratings);
        // console.log("Reviews:", reviews);

        const ratingMap = new Map(ratings.map(r => [r.logId.toString(), r.rating]));
        const reviewMap = new Map(reviews.map(r => [r.logId.toString(), { reviewId: r._id, review: r.review }]));
        const likedMovies = new Set(likes.map(like => like.movieId));
        const movieMap = await getMovieCache(movieIds);

        const logsData = logs.map(log => {
            const movieId = log.movieId;
            const cache = movieMap.get(movieId) || { title: null, poster_path: null, release_date: null };
            return {
                logId: log._id,
                movieId: log.movieId,
                poster_path: cache.poster_path,
                title: cache.title,
                release_date: cache.release_date,
                watchedOn: log.watchedOn,
                rewatch: log.rewatch,
                rating: ratingMap.get(log._id.toString()) || null,
                reviewId: reviewMap.get(log._id.toString())?.reviewId || null,
                review: reviewMap.get(log._id.toString())?.review || null,
                liked: likedMovies.has(log.movieId)
            }
        })

        res.status(200).json({ profilePic,totalLogs: totalLogs, logs: logsData });
    } catch (error) {
        console.error("Error in getLogs:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// REVIEWS PAGE
export const getReviews = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const totalReviews = await Review.countDocuments({ userId });

        const reviews = await Review.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);;

        const logIds = reviews.map(r => r.logId);
        const movieIds = reviews.map(r => r.movieId);

        console.log("Log IDs for fetching:", logIds);

        const checkLogs = await Log.find({ _id: logIds });
        console.log("Existing Logs in DB:", checkLogs);

        const [logs, ratings, likes, movieMap] = await Promise.all([
            Log.find({ _id: { $in: logIds } }, { _id: 1, watchedOn: 1, rewatch: 1 }),
            Rating.find({
                userId,
                $or: [
                    { logId: { $in: logIds } },
                    { logId: null, movieId: { $in: movieIds } }
                ]
            }, { logId: 1, rating: 1, movieId: 1 }),
            Likes.find({ userId, movieId: { $in: movieIds } }, { movieId: 1 }),
            getMovieCache(movieIds)
        ]);
        console.log("Fetched Logs:", logs);


        const logMap = new Map(logs.map(log => [log._id.toString(), { watchedOn: log.watchedOn, rewatch: log.rewatch }]));
        const ratingMap = new Map(ratings.map(r => [(r.logId ? r.logId.toString() : r.movieId.toString()), r.rating]));
        const likedMovies = new Set(likes.map(l => l.movieId));

        const reviewsData = reviews.map(review => {
            const logDetails = logMap.get(review.logId?.toString()) || {};
            const cache = movieMap.get(review.movieId) || { title: null, poster_path: null, release_date: null };

            return {
                reviewId: review._id,
                logId: review.logId,
                movieId: review.movieId,
                poster_path: cache.poster_path,
                title: cache.title,
                release_date: cache.release_date,
                review: review.review,
                spoiler: review.spoiler,
                createdAt: review.createdAt,
                watchedOn: logDetails.watchedOn || null,
                rewatch: logDetails.rewatch || null,
                rating: ratingMap.get(review.logId?.toString()) || ratingMap.get(review.movieId?.toString()) || null,
                liked: likedMovies.has(review.movieId)
            };
        });

        res.status(200).json({ profilePic,totalReviews: totalReviews, reviews: reviewsData });
    } catch (error) {
        console.error("Error in getReviews:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// INDIVIDUAL LOG
export const getLog = async (req, res) => {
    try {
        const { logId } = req.body;
        const log = await Log.findById(logId);
        if (!log) return res.status(404).json({ message: "Log Not Found" });

        const rating = await Rating.findOne({ logId }, { rating: 1, _id: 0 });
        const review = await Review.findOne({ logId }, { review: 1, spoiler: 1, _id: 1 });
        const liked = await Likes.exists({ userId: log.userId, movieId: log.movieId });
        const comments = review ? await Comment.find({ reviewId: review._id }) : [];

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
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// INDIVIDUAL REVIEW
export const getReview = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePic = req.profilePic;
        const username = req.username;
        const { reviewId } = req.params;

        const review = await Review.findOne({_id: reviewId, userId});
        if (!review) return res.status(404).json({ message: "Review Not Found" });

        const log = review.logId ? await Log.findById(review.logId, { watchedOn: 1, rewatch: 1 }) : null;

        const rating = await Rating.findOne(
            review.logId
                ? { logId: review.logId }
                : { logId: null, movieId: review.movieId },
            { rating: 1, _id: 0 }
        );

        const movie = await Movie.findOne(
            { movieId: review.movieId },
            { movieId: 1, title: 1, poster_path: 1, release_date: 1 }
        );

        const liked = await Likes.exists({ userId: review.userId, movieId: review.movieId });

        const comments = await Comment.find({ reviewId })
            .populate("userId", "username profilePic")
            .lean();

        // Format comments to include username and profilePic
        const formattedComments = comments.map(comment => ({
            commentId: comment._id,
            username: comment.userId?.username || "Unknown",
            profilePic: comment.userId?.profilePic || "/avatar.png",
            comment: comment.comment,
            createdAt: comment.createdAt
        }));


        res.json({
            userId,
            username,
            profilePic,
            reviewId: review._id,
            movieId: review.movieId,
            poster_path: movie?.poster_path || null,
            title: movie?.title || "Unknown",
            release_date: movie?.release_date || null,
            review: review.review,
            spoiler: review.spoiler,
            logId: log?._id || null,
            watchedOn: log?.watchedOn || null,
            createdAt: review.createdAt,
            rewatch: log?.rewatch || false,
            rating: rating?.rating || null,
            liked: !!liked,
            comments: formattedComments
        });

    } catch (error) {
        console.error("Error in getReview", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// INDIVIDUAL MOVIE PAGE
export const getMoviePage = async (req, res) => {
    try {
        const { movieName } = req.params;
        const movieDetails = await getMovieDetails(movieName);
        if (!movieDetails) return res.status(404).json({ message: "Movie Not Found" });

        const movieId = movieDetails.movieId;

        // Reviews for that movie and details related to THAT REVIEW
        const reviews = await Review.find({ movieId })
            .populate("userId", "username")
            .sort({ _id: -1 });

        const ratings = await Rating.find({ movieId }, { logId: 1, movieId: 1, rating: 1, _id: 0 });
        const likes = await Likes.find({ movieId }, { userId: 1, _id: 0 });

        const ratingMap = new Map(ratings.map(r => [
            (r.logId ? r.logId.toString() : r.movieId.toString()), r.rating
        ]));

        const likesMap = new Set(likes.map(like => like.userId._id.toString()));

        const reviewsData = reviews.map(review => ({
            reviewId: review._id,
            userId: review.userId._id,
            username: review.userId.username,
            review: review.review,
            spoiler: review.spoiler,
            liked: likesMap.has(review.userId._id.toString()),
            rating: ratingMap.get(review.logId?.toString()) || ratingMap.get(review.movieId.toString()) || null
        }));

        res.json({ movieDetails, reviewsData })

    } catch (error) {
        console.error("Error in getMoviePage", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getHomePage = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const trendingMovies = (await fetchFromTMDB("trending/movie/week", { page })).results.slice(0,10);
        const popularMovies = (await fetchFromTMDB("movie/popular", { page })).results.slice(0,10);
        const topRatedMovies = (await fetchFromTMDB("movie/top_rated", { page })).results.slice(0,10);
        const upcomingMovies = (await fetchFromTMDB("movie/upcoming", { page })).results.slice(0,10);
        const nowPlayingMovies = (await fetchFromTMDB("movie/now_playing", { page })).results.slice(0,10);

        res.status(200).json({ trending: trendingMovies, popular: popularMovies, topRated: topRatedMovies, upcoming: upcomingMovies, nowPlaying: nowPlayingMovies });
    } catch (error) {
        console.error("Error in getHomePage", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}