import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import MovieCard from '../components/MovieCard';
import UserCard from '../components/UserCard';

const WatchlistPage = () => {
    const {username} = useParams();
    const [loading, setloading] = useState(true);
    const [movies, setmovies] = useState([]);
    const [profilePic, setprofilePic] = useState(null);
    const [currentPage, setcurrentPage] = useState(1);
    const [totalMovies, settotalMovies] = useState(0);
    const limit = 10;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/watchlist?page=${currentPage}`);
                setmovies(res.data.watchlist || []);
                setprofilePic(res.data.profilePic || "/avatar.png");
                settotalMovies(res.data.totalMovies);
                console.log("Total Movies:", totalMovies, "Current Page:", currentPage, "Limit:", limit);
            } catch (error) {
                console.error("Error fetching Watchlisted Movies:",error);
            } finally{
                setloading(false);
            }
        };
        fetchMovies();
    },[username, currentPage]);

    if(loading) return <Loading />;
    
    if (movies.length === 0) return (
        <div className='flex items-center justify-center h-screen'>
            <p>Watchlist Movies Not Found</p>
        </div>
    )

    return (
        <div className="my-6 px-4 sm:px-8 lg:px-48">
        <UserCard username={username} profilePic={profilePic} />
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">{username}'s Watchlist</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-20">
            {movies.map((movie) => (
                <div key={movie.movieId} className='relative'>
                    <MovieCard movie={movie} className="relative w-20 h-30 sm:w-24 sm:h-36 md:w-28 md:h-42 lg:w-28 lg:h-40 flex-shrink-0 overflow-hidden group" />
                </div>
            ))}
        </div>
            <div className="flex justify-center mt-6 space-x-4 cursor-pointer">
                {currentPage > 1 && (
                    <button onClick={() => setcurrentPage(currentPage - 1)} className="px-4 py-2 bg-red-700 text-white rounded">Previous</button>
                )}
                {(currentPage * limit) < totalMovies && (
                    <button onClick={() => setcurrentPage(currentPage + 1)} className="px-4 py-2 bg-red-700 text-white rounded">Next</button>
                )}
            </div>
        </div>
    );
};

export default WatchlistPage
