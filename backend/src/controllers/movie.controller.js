import { fetchFromTMDB } from "../lib/tmdb.js";
import Movie from "../models/movie.model.js";

export const searchMovieByName = async (query) => {
    // UTILITY FUNCTION
    // takes movie name and converts it to movieid if same movie name is found
    try {
        if (!query) throw new Error("Query Parameter Missing");

        const match = query.match(/^(.*?)-(\d{4})$/);
        const movieName = match ? match[1] : query;
        const year = match ? match[2] : null;

        const q = encodeURIComponent(movieName);
        
        // console.log(movieName);
        // console.log(q);
        // console.log(year);

        const data = await fetchFromTMDB(`search/movie?query=${q}`);

        if (!data.results.length) return null;

        const matchingMovies = data.results.filter(movie => movie.title === movieName);

        if (year) {
            const exactYearMatch = matchingMovies.find(movie => movie.release_date?.startsWith(year));
            return exactYearMatch ? exactYearMatch.id : null;
        };

        const mostPopular = matchingMovies.sort((a, b) => b.popularity - a.popularity)[0];
        return mostPopular ? mostPopular.id : null;

    } catch (error) {
        console.error("Error in searchMoviebyName:", error.message);
        throw error;
    }
}

export const searchMovies = async (req, res) => {
    // SEARCHBAR
    // shows all related movies to that movie name
    try {
        const { q, page = 1 } = req.query;
        if (!q) return res.status(400).json({ message: "Query parameter missing" });
        const data = await fetchFromTMDB("search/movie", { query: q, page });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in searchMovies:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMovieDetails = async (movieName) => {
    try {
        if (!movieName) throw new Error("Movie Name Query Missing");
        // const movieName = "Spider-Man:%20No%20Way%20Home";
        // const decodedName = decodeURIComponent(movieName);
        // console.log(decodedName); 
        
        const movieId = await searchMovieByName(movieName);
        if (!movieId) return null;

        const data = await fetchFromTMDB(`movie/${movieId}?append_to_response=credits,videos,watch/providers`);

        const similarMovies = (await fetchFromTMDB(`movie/${movieId}/similar?page=1`)).results.slice(0,10);
        
        const recommendedMovies = (await fetchFromTMDB(`movie/${movieId}/recommendations?page=1`)).results.slice(0,10);


        // console.log(data);

        const existingMovie = await Movie.findOne({ movieId });

        // Add to Movie model DB for cache -> used in all getAction functions for PAGES - title,year,poster_path
        if (!existingMovie) {
            await Movie.create({
                movieId: movieId,
                title: data.title,
                release_date: data.release_date,
                genres: data.genres.map(g => g.name),
                poster_path: data.poster_path
            });
        }

        return {
            movieId,
            poster: data.poster_path || null,
            backdrop: data.backdrop_path || null,
            title: data.title,
            year: data.release_date?.split("-")[0] || "Unknown",
            runtime: data.runtime,
            popularity: data.popularity,
            director: data.credits.crew.find(person => person.job === "Director")?.name || "Unknown",
            tagline: data.tagline || "",
            overview: data.overview || "",
            cast: data.credits.cast.slice(0,50).map(actor => `${actor.name} - ${actor.character}`),
            crew: data.credits.crew.slice(0,50).map(person => `${person.job} - ${person.name}`),
            details: {
                studio: data.production_companies.map(company => company.name),
                country: data.production_countries.map(country => country.name),
                language: data.spoken_languages.map(lang => lang.english_name)
            },
            genres: data.genres.map(genre => genre.name),
            trailer: data.videos.results.find(video => video.type === "Trailer" && video.site === "YouTube")?.key
                ? `https://www.youtube.com/watch?v=${data.videos.results.find(video => video.type === "Trailer" && video.site === "YouTube").key}`
                : null,
            platforms: data["watch/providers"].results.IN || {},
            rating: data.vote_average.toFixed(1),
            similarMovies,
            recommendedMovies
        };

    } catch (error) {
        console.error("Error in getMovieDetails:", error.message);
        throw error;
    }
}

export const getMovieCache = async (movieIds) => {
    try {
        if(movieIds.length === 0) return new Map();
        
        const movies = await Movie.find(
            {movieId: {$in: movieIds}},
            {movieId:1,title:1,poster_path:1,release_date:1}
        );
        
        return new Map(movies.map(m => [m.movieId, {
            title: m.title,
            poster_path: m.poster_path,
            release_date: m.release_date
        }]));

    } catch (error) {
        console.error("Error in getMovieCache:",error.message);
        throw error;
    }
};


export const getMoviesByGenre = async (req, res) => {
    try {
        const { genreId } = req.params;
        const { page = 1 } = req.query;

        if (isNaN(genreId) || genreId < 0) {
            return res.status(400).json({ message: "Invalid genre ID" });
        }

        const data = await fetchFromTMDB("discover/movie", { with_genres: genreId, page });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in gerMoviesByGenre:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}