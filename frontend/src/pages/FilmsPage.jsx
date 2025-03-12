import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, StarHalf, Heart, MessageSquareText, ArrowLeft, ArrowRight } from "lucide-react";
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import MovieCard from '../components/MovieCard';
import UserCard from '../components/UserCard';
import { useNavigate } from 'react-router-dom';

const FilmsPage = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const [loading, setloading] = useState(true);
    const [movies, setmovies] = useState([]);
    const [profilePic, setprofilePic] = useState(null);
    const [currentPage, setcurrentPage] = useState(1);
    const [totalMovies, settotalMovies] = useState(0);
    const [iconSize, setIconSize] = useState(8);
    const limit = 40;

    useEffect(() => {
        const handleResize = () => {
            setIconSize(window.innerWidth >= 768 ? 16 : 8);
        };

        handleResize(); // Set initial size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setloading(true);
        const fetchMovies = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/films?page=${currentPage}`);
                setmovies(res.data.watched || []);
                setprofilePic(res.data.profilePic || "/avatar.png");
                settotalMovies(res.data.totalMovies);
            } catch (error) {
                console.error("Error fetching Watched Movies:", error.message);
            } finally {
                setloading(false);
            }
        };
        fetchMovies();
    }, [username, currentPage]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <div className="flex items-center gap-0.5 text-yellow-500">
                {[...Array(fullStars)].map((_, i) => <Star key={i} size={16} fill="currentColor" stroke="none" />)}
                {hasHalfStar && <StarHalf size={16} fill="currentColor" stroke="none" />}
            </div>
        );
    };


    if (loading) return <Loading />;

    if (movies.length === 0) return (
        <div className="max-w-4xl mx-auto p-4">
            <UserCard username={username} profilePic={profilePic} />
            <div className='flex items-center justify-center h-screen'>
                <p className="text-gray-400 text-lg">No Watched Movies Yet</p>
            </div>
        </div>
    );

    return (
        <div className="my-6 px-4 min-h-dvh sm:px-8 lg:px-32">
            <UserCard username={username} profilePic={profilePic} />
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">{username}'s Watched Films</h2>

            {/* Movie Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 sm:gap-10">
                {movies.map((movie) => (
                    <div key={movie.movieId} className="relative">
                        <MovieCard
                            movie={movie}
                            className="relative w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-48 lg:w-36 lg:h-52 flex-shrink-0 overflow-hidden group"
                        />
                        {/* Rating, Like, Review Section */}
                        <div className="flex items-center gap-1 mt-1 text-gray-300">
                            {/* Rating Stars - Only show filled stars */}
                            {movie.rating > 0 && (
                                <div className="flex items-center gap-0.5">
                                    {[...Array(Math.floor(movie.rating))].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="text-yellow-400 fill-yellow-400"
                                            size={iconSize}
                                        />
                                    ))}
                                    {movie.rating % 1 !== 0 && (
                                        <StarHalf
                                            className="text-yellow-400 fill-yellow-400"
                                            size={iconSize}
                                        />
                                    )}
                                </div>
                            )}
                            {/* Like Icon */}
                            {movie.liked && (
                                <Heart
                                    className="text-red-500 fill-red-500"
                                    size={iconSize}
                                />
                            )}
                            {/* Review Icon */}
                            {movie.reviewId && (
                                <MessageSquareText
                                    className="text-blue-400 cursor-pointer hover:text-blue-300"
                                    size={iconSize}
                                    onClick={() => navigate(`/${username}/review/${movie.reviewId}`)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-4">
                {currentPage > 1 && (
                    <button onClick={() => setcurrentPage(currentPage - 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
                        <ArrowLeft size={16} /> Previous
                    </button>
                )}
                {(currentPage * limit) < totalMovies && (
                    <button onClick={() => setcurrentPage(currentPage + 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
                        Next <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilmsPage;
