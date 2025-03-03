import express from "express";
import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getMoviesByGenre } from "../controllers/movie.controller.js";
import { validateMovie } from "../middleware/movie.middleware.js";

const router = express.Router();

router.get("/search", searchMovies);
router.get("/details/:movieName", getMovieDetails);
router.get("/trending", getTrendingMovies);
router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/genre/:genreId", getMoviesByGenre);


export default router;