import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import MovieCard from '../components/MovieCard';

const LikesPage = () => {
    const {username} = useParams();
    const [loading, setloading] = useState(true);
    const [movies, setmovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/likes`);
                setmovies(res.data.liked || []);
            } catch (error) {
                console.error("Error fetching Liked Movies:",error);
            } finally{
                setloading(false);
            }
        };
        fetchMovies();
    },[username]);

    if (loading) return <Loading />;

    if (movies.length === 0) return (
        <div className='flex items-center justify-center h-screen'>
            <p>Liked Movies Not Found</p>
        </div>
    )

    return (
        <div className="my-6 px-4 sm:px-8 lg:px-48">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Liked</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.slice(0, 10).map((movie) => (
                    <div key={movie.movieId} className='relative'>
                        <MovieCard movie={movie} className="relative w-40 h-60 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group" />
                        <div className="mt-2 text-center text-gray-300">
                            {movie.rating !== null && <p>⭐ {movie.rating}</p>}
                            {movie.liked && <p>❤️ Watched</p>}
                            {movie.reviewId && <p>📝 R</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikesPage
