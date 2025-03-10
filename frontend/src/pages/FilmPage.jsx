import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getMoviePoster } from "../lib/poster";
import { Heart, Star, PlayCircle, Film, Popcorn } from "lucide-react";
import Loading from "../components/Loading";
import ActionForm from "../components/ActionForm";
import { useAuthStore } from "../store/useAuthStore";
import MovieCard from "../components/MovieCard";

const FilmPage = () => {
    const { authUser } = useAuthStore();
    const username = authUser ? authUser.username : null;
    const { movieName } = useParams();
    // console.log(movieName);
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setloading] = useState(true);
    const [showSpoiler, setshowSpoiler] = useState(false);
    const navigate = useNavigate();

    // console.log(loading);

    useEffect(() => {
        setloading(true);
        const fetchMovie = async () => {
            try {
                const res = await axiosInstance.get(`/page/details/${movieName}`);
                setMovie(res.data.movieDetails);
                setReviews(res.data.reviewsData);
                console.log(res.data.movieDetails);
            } catch (error) {
                console.error("Error fetching movie:", error.message);
            } finally {
                setloading(false);
            }
        };
        const scroll = async () => {
            var a = await fetchMovie();
            window.scrollTo(0, 0);
        }
        scroll();
    // scrollIntoView({ behavior: "smooth" });

    }, [movieName]);

    if (loading) return <Loading />;

    console.log(movie);
    if (!movie) return (
        <div className='flex items-center justify-center h-screen'>
            <p>Movies Not Found</p>
        </div>
    )

    return (
        <div className="text-white px-20 py-10 relative">
            {/* Backdrop Image */}
            <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: `url(${getMoviePoster(movie.backdrop, "original")})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)' }}></div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-12 relative">
                {/* Left Column - Poster */}
                <div className="md:w-1/5 w-full text-center">
                    <img
                        src={getMoviePoster(movie.poster, "w500")}
                        alt={movie.title}
                        className="w-[200px] h-[300px] md:w-full md:h-auto rounded-lg mx-auto"
                    />
                    <p className="text-gray-400 mt-2">Runtime: {movie.runtime} min</p>
                </div>

                {/* Center Column - Movie Info */}
                <div className="flex-1 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">{movie.title} <span className="text-gray-400 text-2xl">({movie.year})</span></h1>
                    <p className="text-lg text-gray-400 mt-1">Directed by <span className="text-white">{movie.director}</span></p>
                    <p className="mt-4 text-gray-200 font-medium text-xl">{movie.tagline}</p>
                    <p className="mt-4 text-gray-400 text-lg">{movie.overview}</p>
                </div>
                {/* Right Column - Action Form (Moves Below on Mobile) */}
                <div className=" text-center md:w-1/4 mt-8 md:mt-0 w-[300px] h-[300px] md:h-auto rounded-lg mx-auto mb-10">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg ">
                        <p className="text-gray-300 text-center font-serif border-b border-gray-700 mb-5 pb-2">
                            What do you think about this film?
                        </p>
                        <ActionForm movieId={movie.movieId} movieName={movieName} username={username} authUser={authUser} />
                    </div>
                    <div className="text-center mt-4 gap-2">
                        <div className="flex justify-center mt-2 text-yellow-500">
                            <Popcorn />
                        </div>
                        <p className="text-xl font-bold text-center mt-2">{movie.rating}/10</p>
                    </div>
                </div>
            </div>



            {/* Mini Navbar */}
            <div className="mt-8 border-b border-gray-700 flex gap-6 text-gray-400 text-lg pb-2">
                <span className="cursor-pointer hover:text-white">Cast</span>
                <span className="cursor-pointer hover:text-white">Crew</span>
                <span className="cursor-pointer hover:text-white">Details</span>
                <span className="cursor-pointer hover:text-white">Genres</span>
            </div>

            {/* Movie Details */}
            <div className="mt-6 flex gap-12">
                {/* Left - Trailer & Platforms */}
                <div className="w-1/5">
                    {movie.trailer && (
                        <a
                            href={movie.trailer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:underline"
                        >
                            <PlayCircle /> Watch Trailer
                        </a>
                    )}

                    <div className="mt-4">
                        {Object.entries(movie.platforms || {}).map(([type, providers]) => (
                            Array.isArray(providers) && providers.length > 0 ? (
                                <div key={type} className="mb-4">
                                    <h3 className="text-lg font-bold capitalize">{type}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {providers.map((provider, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                                            >
                                                {provider.provider_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>


                {/* Center - Details */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    {/* Cast */}
                    <div>
                        <h3 className="text-lg font-bold">Cast</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.cast.map((actor, i) => {
                                const [name, character] = actor.split(" - ");
                                return (
                                    <div key={i} className="relative group">
                                        <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-12 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                            {character}
                                        </span>
                                        <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded cursor-pointer group-hover:text-white">
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Crew */}
                    <div>
                        <h3 className="text-lg font-bold">Crew</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.crew.map((member, i) => {
                                const [job, person] = member.split(" - ");
                                return (
                                    <div key={i} className="relative group">
                                        <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-12 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                            {job}
                                        </span>
                                        <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded cursor-pointer group-hover:text-white">
                                            {person}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
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
                            <div onClick={() => navigate(`/${review.username}/review/${review.reviewId}`)} className="flex items-center gap-2 cursor-pointer">

                                Review by <p className="inline font-semibold">{review.username}</p>
                                {Number.isInteger(review.rating) && review.rating > 0 && (
                                    <p className="text-green-500 fill-green-500 flex items-center">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} fill="currentColor" className="w-4 h-4" />
                                        ))}
                                    </p>
                                )}

                                {review.liked && <p className="text-orange-400 "><Heart fill="currentColor" className="w-4 h-4" /></p>}
                            </div>
                            <p
                                className={`text-gray-300 ${review.spoiler && !showSpoiler ? "bg-red-700 text-white p-2 rounded cursor-pointer" : ""}`}
                                onClick={() => setshowSpoiler(true)}
                            >
                                {review.spoiler && !showSpoiler ? "⚠ Spoiler Hidden (Click to Reveal)" : review.review}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <div className="my-6 px-4 sm:px-8 lg:px-48">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Similar Movies</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {movie.similarMovies.map((m) => (
                        <MovieCard key={m.id} movie={m} className="relative w-40 h-60 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group" />
                    ))}
                </div>
            </div>
            <div className="my-6 px-4 sm:px-8 lg:px-48">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Recommended Movies</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {movie.recommendedMovies.map((m) => (
                        <MovieCard key={m.id} movie={m} className="relative w-40 h-60 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group" />
                    ))}
                </div>
            </div>

        </div >
    );
};

export default FilmPage;
