import { fetchFromTMDB } from "../lib/tmdb.js";

export const searchMovieByName = async (query) => {
    // UTILITY FUNCTION
    // takes movie name and converts it to movieid if same movie name is found
    try {
        if (!query) throw new Error("Query Parameter Missing");

        const match = query.match(/^(.*?)-(\d{4})$/);
        const formattedName = match ? match[1] : query;
        const year = match ? match[2] : null;

        const movieName = formattedName.replace(/-/g, " ").toLowerCase();

        const q = encodeURIComponent(movieName);
        const data = await fetchFromTMDB(`search/movie?query=${q}&page=1`);

        if (!data.results.length) return null;

        const matchingMovies = data.results.filter(movie => movie.title.toLowerCase() === movieName);

        // let exactMatch = data.results.find(movie => movie.title.toLowerCase() === movieName);

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
        const movieId = await searchMovieByName(movieName);
        if (!movieId) return null;

        const data = await fetchFromTMDB(`movie/${movieId}?append_to_response=credits,alternative_titles,release_dates,videos,watch/providers`);

        // console.log(data);

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
            cast: data.credits.cast.map(actor => `${actor.name} - ${actor.character}`),
            crew: data.credits.crew.map(person => `${person.job} - ${person.name}`),
            details: {
                studio: data.production_companies.map(company => company.name),
                country: data.production_countries.map(country => country.name),
                language: data.spoken_languages.map(lang => lang.english_name),
                alternativeTitles: data.alternative_titles.titles.map(title => title.title),
            },
            genres: data.genres.map(genre => genre.name),
            releases: data.release_dates.results.map(release => ({
                country: release.iso_3166_1,
                year: release.release_dates[0]?.release_date?.split("-")[0] || "Unknown"
            })),
            trailer: data.videos.results.find(video => video.type === "Trailer" && video.site === "YouTube")?.key
                ? `https://www.youtube.com/watch?v=${data.videos.results.find(video => video.type === "Trailer" && video.site === "YouTube").key}`
                : null,
            platforms: data["watch/providers"].results.IN || {},
            rating: data.vote_average.toFixed(1),
        };

    } catch (error) {
        console.error("Error in getMovieDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTrendingMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const data = await fetchFromTMDB("trending/movie/week", { page });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getTrendingMovies:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getPopularMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const data = await fetchFromTMDB("movie/popular", { page });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getPopularMovies:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTopRatedMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const data = await fetchFromTMDB("movie/top_rated", { page });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getTopRatedMovies:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

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