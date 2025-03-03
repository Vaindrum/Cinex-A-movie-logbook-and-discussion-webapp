import { fetchFromTMDB } from "../lib/tmdb.js";

// Made this because all the movie details were fetched by movieId before
// Now I've changed it so that movie details are fetched via movieName

export const validateMovie = async (req, res, next) => {
    const movieId = Number(req.params.movieId);

    if(isNaN(movieId) || movieId<0){
        return res.status(400).json({message: "Invalid Movie ID"});
    }

    const movie = await fetchFromTMDB(`movie/${movieId}`);
    
    if(!movie || movie.status_code === 34){
        return res.status(404).json({message: "Movie Not Found"});
    }

    req.movieId = movieId;
    next();
};

