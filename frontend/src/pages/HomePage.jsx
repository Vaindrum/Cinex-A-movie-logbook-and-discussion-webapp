import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSection = ({ title, movies }) => {
  const scrollRef = useRef(null);

  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p>No movies found for {title}</p>
      </div>
    );
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.firstChild.offsetWidth + 16; // Get card width + gap
      container.scrollBy({ left: direction === "left" ? -cardWidth * 4 : cardWidth * 4, behavior: "smooth" });
    }
  };

  return (
    <div className="my-6 sm:px-8 lg:px-35 relative">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative flex items-center">
        <button onClick={() => scroll("left")} className="hidden lg:block absolute -left-10 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
          <ChevronLeft />
        </button>
        <div ref={scrollRef} className="flex lg:gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory w-full transition-transform duration-500 ease-in-out">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              className="relative w-[25%] px-0.5 sm:w-[25%] md:w-[20%] lg:w-[19%] flex-shrink-0 overflow-hidden group snap-start"
            />
          ))}
        </div>
        <button onClick={() => scroll("right")} className="hidden lg:block absolute -right-8 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};


const HomePage = () => {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get("/page/home");
        setMovies(res.data);
      } catch (error) {
        setError("Failed to load movies. Please try again.");
        console.error("Error fetching homepage movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <MovieSection title="Trending Movies" movies={movies.trending} />
      <MovieSection title="Popular Movies" movies={movies.popular} />
      <MovieSection title="Now Playing Movies" movies={movies.nowPlaying} />
      <MovieSection title="Upcoming Movies" movies={movies.upcoming} />
      <MovieSection title="Top-Rated Movies" movies={movies.topRated} />
    </div>
  );
};

export default HomePage;
