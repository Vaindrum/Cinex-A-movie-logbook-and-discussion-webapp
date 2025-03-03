import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getMoviePoster } from "../lib/poster";
import { Heart, Star, Loader, PlayCircle, Film, Popcorn } from "lucide-react";

const FilmPage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axiosInstance.get(`/page/details/${movieId}`);
                setMovie(res.data.movieDetails);
                setReviews(res.data.reviewsData);
            } catch (error) {
                console.error("Error fetching movie:", error.message);
            }
        };
        fetchMovie();
    }, [movieId]);

    if (!movie) return (
        <div className='flex items-center justify-center h-screen'>
            <Loader className="size-10 animate-spin" />
        </div>
    );

    return (
        <div className="text-white px-20 py-10 relative">
            {/* Backdrop Image */}
            <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: `url(${getMoviePoster(movie.backdrop, "original")})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)' }}></div>

            {/* Main Content */}
            <div className="flex gap-12 relative">
                {/* Left Column - Poster */}
                <div className="w-1/5">
                    <img src={getMoviePoster(movie.poster, "w500")} alt={movie.title} className="w-full rounded-lg" />
                </div>

                {/* Center Column - Movie Info */}
                <div className="flex-1 text-center">
                    <h1 className="text-5xl font-bold">{movie.title} <span className="text-gray-400 text-2xl">({movie.year})</span></h1>
                    <p className="text-lg text-gray-400 mt-1">Directed by <span className="text-white">{movie.director}</span></p>
                    <p className="mt-4 text-gray-200 font-medium text-xl">{movie.tagline}</p>
                    <p className="mt-4 text-gray-400 text-lg">{movie.overview}</p>
                </div>

                {/* Right Column - Rating Placeholder */}
                <div className="w-1/5 bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500">[Placeholder for Rating, Watched, Log, Review Form]</p>
                </div>
                <div className="text-center mt-4">
                    <p className="text-gray-500">Rating</p>
                    <div className="flex justify-center mt-2 text-yellow-500">
                        <Popcorn />
                    </div>
                    <p className="text-xl font-bold text-center mt-2">{movie.rating}/10</p>
                    <p className="text-gray-400 text-center mt-2">Runtime: {movie.runtime} min</p>
                </div>

            </div>

            {/* Mini Navbar */}
            <div className="mt-8 border-b border-gray-700 flex gap-6 text-gray-400 text-lg pb-2">
                <span className="cursor-pointer hover:text-white">Cast</span>
                <span className="cursor-pointer hover:text-white">Crew</span>
                <span className="cursor-pointer hover:text-white">Details</span>
                <span className="cursor-pointer hover:text-white">Genres</span>
                <span className="cursor-pointer hover:text-white">Releases</span>
            </div>

            {/* Movie Details */}
            <div className="mt-6 flex gap-12">
                {/* Left - Trailer & Platforms */}
                <div className="w-1/5">
                    {movie.trailer && <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline"><PlayCircle /> Watch Trailer</a>}
                    <p className="text-gray-400 mt-4">Available on:</p>
                    <p className="text-white">{Object.keys(movie.platforms).join(", ") || "N/A"}</p>
                </div>

                {/* Center - Details */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-bold">Cast</h3>
                        {movie.cast.map((actor, i) => (
                            <div key={i} className="text-gray-400 hover:text-white">{actor}</div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Crew</h3>
                        {movie.crew.slice(0, 5).map((member, i) => (
                            <div key={i} className="text-gray-400 hover:text-white">{member}</div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Details</h3>
                        <p className="text-gray-400">Studio: {movie.details.studio.join(", ")}</p>
                        <p className="text-gray-400">Country: {movie.details.country.join(", ")}</p>
                        <p className="text-gray-400">Language: {movie.details.language.join(", ")}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Genres</h3>
                        {movie.genres.map((genre, i) => (
                            <span key={i} className="text-gray-400 bg-gray-800 px-2 py-1 rounded mr-2">{genre}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <h2 className="text-xl mt-6 px-6">User Reviews</h2>
            <div className="mt-4 px-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.reviewId} className="border-b border-gray-700 py-4">
                            <div className="flex items-center gap-2">

                                Review by <p className="inline font-semibold">{review.username}</p>
                                {review.rating !== null && (
                                    <p className="text-green-500 fill-green-500  flex items-center">{[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} fill="currentColor" className="w-4 h-4" />
                                    ))}
                                    </p>
                                )}
                                {review.liked && <p className="text-orange-400 "><Heart fill="currentColor" className="w-4 h-4" /></p>}
                            </div>
                            <p className={`text - gray - 300 ${review.spoiler ? "bg-red-700 text-white p-2 rounded" : ""}`}>
                            {review.spoiler ? "⚠ Spoiler Hidden" : review.review}
                        </p>
                        </div>
            ))
                )}
        </div>


        </div >
        );
};

export default FilmPage;
