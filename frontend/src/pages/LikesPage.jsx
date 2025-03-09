import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, StarHalf, Eye, MessageSquareText, ArrowLeft, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import MovieCard from '../components/MovieCard';
import UserCard from '../components/UserCard';

const LikesPage = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const [loading, setloading] = useState(true);
    const [movies, setmovies] = useState([]);
    const [profilePic, setprofilePic] = useState(null);
    const [currentPage, setcurrentPage] = useState(1);
    const [totalMovies, settotalMovies] = useState(0);
    const limit = 40;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/likes?page=${currentPage}`);
                setmovies(res.data.liked || []);
                setprofilePic(res.data.profilePic || "/avatar.png");
                settotalMovies(res.data.totalMovies);
            } catch (error) {
                console.error("Error fetching Liked Movies:", error.message);
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
        <div className='flex items-center justify-center h-screen'>
            <p className="text-gray-400 text-lg">Liked Movies Not Found</p>
        </div>
    );

    return (
        <div className="my-6 px-4 sm:px-8 lg:px-32">
            <UserCard username={username} profilePic={profilePic} />
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">{username}'s Liked Films</h2>

            <div className=" grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 sm:gap-10">
                {movies.map((movie) => (
                    <div key={movie.movieId} className="relative">
                        <MovieCard 
                            movie={movie} 
                            className="relative w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-48 lg:w-36 lg:h-52 flex-shrink-0 overflow-hidden group" 
                        />
                        <div className="flex items-center justify-center mt-2 text-gray-300 text-xs sm:text-sm gap-2">
                            {movie.rating !== null && renderStars(movie.rating)}
                            {/* {movie.watched && <Eye size={16} className="text-green-400" />} */}
                            {movie.reviewId && <MessageSquareText size={16} className="text-blue-400 cursor-pointer" onClick={() => navigate(`/${username}/review/${movie.reviewId}`)} />}
                        </div>
                    </div>
                ))}
            </div>

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

export default LikesPage;
