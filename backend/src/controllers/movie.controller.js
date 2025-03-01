import { fetchFromTMDB } from "../lib/tmdb.js";

export const searchMovies = async(req,res) => {
    try {
        const {q, page = 1} = req.query;
        if(!q) return res.status(400).json({message:"Query parameter missing"});
        const data = await fetchFromTMDB("search/movie", {query: q, page});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in searchMovies:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMovieDetails = async (movieId) => {
    try {
        return await fetchFromTMDB(`movie/${movieId}`);
    } catch (error) {
        console.error("Error in getMovieDetails:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getTrendingMovies = async (req,res) => {
    try {
        const {page = 1} = req.query;
        const data = await fetchFromTMDB("trending/movie/week", {page});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getTrendingMovies:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getPopularMovies = async (req,res) => {
    try {
        const {page = 1} = req.query;
        const data = await fetchFromTMDB("movie/popular", {page});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getPopularMovies:",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getTopRatedMovies = async (req,res) => {
    try {
        const {page = 1} = req.query;
        const data = await fetchFromTMDB("movie/top_rated", {page});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getTopRatedMovies:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMoviesByGenre = async (req,res) => {
    try {
        const {genreId} = req.params;
        const {page = 1} = req.query;

        if(isNaN(genreId) || genreId<0){
            return res.status(400).json({message: "Invalid genre ID"});
        }

        const data = await fetchFromTMDB("discover/movie", {with_genres: genreId, page});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in gerMoviesByGenre:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}