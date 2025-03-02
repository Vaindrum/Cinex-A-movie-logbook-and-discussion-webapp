import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const MovieCard = ({ movie }) => {
  return (
    <div className="relative w-40 h-60 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group">
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title} 
      className="w-full h-full object-cover rounded-xl transition duration-300 group-hover:opacity-50" />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="text-white text-sm sm:text-base md:text-lg font-bold text-center">{movie.title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm">{movie.year}</p>
      </div>
    </div>
  );
};


const MovieSection = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get(fetchUrl);
        setMovies(res.data.results || []); // Store only results
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      }
    };
    fetchMovies();
  }, [fetchUrl, title]);

  // console.log(`${title} Movies:`, movies);

  return (
    <div className="my-6 px-4 sm:px-8 lg:px-16">
    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">{title}</h2>
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <MovieSection title="Trending Movies" fetchUrl="/movies/trending" />
      <MovieSection title="Popular Movies" fetchUrl="/movies/popular" />
      <MovieSection title="Top-Rated Movies" fetchUrl="/movies/top-rated" />
    </div>
  );
};

export default HomePage;
