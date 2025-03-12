import React from 'react';


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getMoviePoster } from "../lib/poster";
import { Heart, Star, PlayCircle, Film, Popcorn, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../components/Loading";
import ActionForm from "../components/ActionForm";
import { useAuthStore } from "../store/useAuthStore";
import MovieCard from "../components/MovieCard";
import ImageModal from "../components/ImageModal";

const FilmPage = () => {
    const { authUser } = useAuthStore();
    const username = authUser ? authUser.username : null;
    const { movieName } = useParams();
    // console.log(movieName);
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setloading] = useState(true);
    const [showSpoiler, setshowSpoiler] = useState(false);
    const [showFullCast, setShowFullCast] = useState(false);
    const [showFullCrew, setShowFullCrew] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const similarRef = React.useRef(null);
    const recommendedRef = React.useRef(null);

    const navigate = useNavigate();

    const scroll = (direction, section) => {
        const container = section === "similar" ? similarRef.current : recommendedRef.current;
        if (container) {
            const cardWidth = container.firstChild.offsetWidth + 16; // Get card width + gap
            container.scrollBy({ 
                left: direction === "left" ? -cardWidth * 4 : cardWidth * 4, 
                behavior: "smooth" 
            });
        }
    };

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
        <div className="text-white min-h-dvh px-10 lg:px-20 py-10 relative">
            {/* Backdrop Image */}
            <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: `url(${getMoviePoster(movie.backdrop, "original")})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)' }}></div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-12 relative">
                {/* Left Column - Poster */}
                <div className="md:w-1/5 w-full text-center">
                    <img
                        src={getMoviePoster(movie.poster, "w500")}
                        alt={movie.title}
                        className="cursor-pointer w-[200px] h-[300px] md:w-full md:h-auto rounded-lg mx-auto"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
                <ImageModal 
                isOpen={modalOpen} 
                imageUrl={getMoviePoster(movie.poster, "w500")} 
                onClose={() => setModalOpen(false)}
            />

                {/* Center Column - Movie Info */}
                <div className="flex-1 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">{movie.title} <span className="text-gray-400 text-2xl">({movie.year})</span></h1>
                    <p className="text-lg text-gray-400 mt-1">Directed by <span className="text-white">{movie.director}</span></p>
                    <p className="mt-4 text-gray-200 font-medium text-xl">{movie.tagline}</p>
                    <p className="mt-4 text-gray-400 text-lg">{movie.overview}</p>
                    <p className="text-gray-300 mt-2">Runtime: {movie.runtime} min</p>
                </div>
                {/* Right Column - Action Form (Moves Below on Mobile) */}
                <div className=" text-center md:w-1/4 mt-8 md:mt-0 w-[300px] h-[300px] md:h-auto rounded-lg mx-auto mb-10">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg ">
                        <p className="text-gray-300 text-center font-serif border-b border-gray-700 mb-5 pb-2">
                            What do you think about this film?
                        </p>
                        <ActionForm movieId={movie.movieId} movieName={movieName} username={username} authUser={authUser} />
                    </div>
                    <div className="text-center mt-4">
                        <div className="flex items-center justify-center gap-2 mt-2 md:flex-col">
                            <Popcorn className=" text-yellow-500" />
                            <p className="text-xl font-bold">{movie.rating}/10</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Outer div for mobile only */}
            <div className="w-[300px] mx-auto mb-10 md:hidden">
                <div className="mt-4 border-b border-hidden flex justify-center gap-6 pb-2">
                    {movie.trailer && (
                        <a
                            href={movie.trailer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex mt-3 items-center gap-2 text-blue-400 hover:underline"
                        >
                            <PlayCircle /> Watch Trailer
                        </a>
                    )}
                </div>
            </div>

            {/* Direct content for desktop (without outer div) */}
            <div className="hidden md:block mt-8 border-b border-hidden justify-center gap-6 pb-2">
                {movie.trailer && (
                    <a
                        href={movie.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex mt-3 items-center gap-2 text-blue-400 "
                    >
                        <PlayCircle /> Watch Trailer
                    </a>
                )}
            </div>



            {/* Mini Navbar */}
            <div className="mt-8 border-b border-gray-700 flex gap-6 text-gray-400 text-lg pb-2">
                <a href="#cast" className=" cursor-pointer">Cast</a>
                <a href="#crew" className="cursor-pointer ">Crew</a>
                <a href="#details" className="cursor-pointer">Details</a>
                <a href="#genres" className="cursor-pointer">Genres</a>
            </div>

            {/* Movie Details */}
            <div className="mt-2 flex-1 gap-12">
                {/* Left - Trailer & Platforms */}
                <div className="w-1/5">

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cast */}

                    {/* Cast Section */}
                    <div id="cast" className="mb-6">
                        <h3 className="text-lg font-bold">Cast</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.cast.slice(0, showFullCast ? movie.cast.length : 10).map((actor, i) => {
                                const [name, character] = actor.split(" - ");
                                return (
                                    <div key={i} className="relative group min-w-[80px] text-center">
                                        <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-12 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                            {character}
                                        </span>
                                        <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded cursor-pointer group-hover:text-white inline-block">
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {movie.cast.length > 10 && (
                            <button onClick={() => setShowFullCast(!showFullCast)} className="cursor-pointer text-blue-500 mt-2">
                                {showFullCast ? "Show Less..." : "Show More..."}
                            </button>
                        )}
                    </div>

                    {/* Crew Section */}
                    <div id="crew" className="mb-6">
                        <h3 className="text-lg font-bold">Crew</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.crew.slice(0, showFullCrew ? movie.crew.length : 10).map((member, i) => {
                                const [job, person] = member.split(" - ");
                                return (
                                    <div key={i} className="relative group min-w-[80px] text-center">
                                        <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-12 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                            {job}
                                        </span>
                                        <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded cursor-pointer group-hover:text-white inline-block">
                                            {person}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {movie.crew.length > 10 && (
                            <button onClick={() => setShowFullCrew(!showFullCrew)} className="cursor-pointer text-blue-500 mt-2">
                                {showFullCrew ? "Show Less..." : "Show More..."}
                            </button>
                        )}
                    </div>

                    {/* Details Section */}
                    <div id="details" className="mb-6">
                        <h3 className="text-lg font-bold">Details</h3>
                        <p className="text-gray-400">Studio: {movie.details.studio.join(", ")}</p>
                        <p className="text-gray-400">Country: {movie.details.country.join(", ")}</p>
                        <p className="text-gray-400">Language: {movie.details.language.join(", ")}</p>
                    </div>

                    {/* Genres Section */}
                    <div id="genres">
                        <h3 className="text-lg font-bold">Genres</h3>
                        {movie.genres.map((genre, i) => (
                            <span key={i} className="text-gray-400 bg-gray-800 px-2 py-1 rounded mr-2 inline-block">
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <h2 className="text-xl font-bold mt-6">User Reviews</h2>
            <div className="mt-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <>
                        {reviews.slice(0, showAllReviews ? reviews.length : 4).map((review) => (
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
                                    {review.liked && <p className="text-orange-400"><Heart fill="currentColor" className="w-4 h-4" /></p>}
                                </div>
                                <p
                                    className={`text-gray-300 ${review.spoiler && !showSpoiler ? "bg-red-700 text-white p-2 rounded cursor-pointer" : ""}`}
                                    onClick={() => setshowSpoiler(true)}
                                >
                                    {review.spoiler && !showSpoiler ? "⚠ Spoiler Hidden (Click to Reveal)" : review.review}
                                </p>
                            </div>
                        ))}

                        {reviews.length > 4 && (
                            <button onClick={() => setShowAllReviews(!showAllReviews)} className="cursor-pointer text-blue-500 mt-2">
                                {showAllReviews ? "Show Less..." : "Show More..."}
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="my-6 lg:px-21">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Similar Movies</h2>
                <div className="relative flex items-center">
                    <button onClick={() => scroll("left", "similar")} className="hidden lg:block absolute -left-10 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
                        <ChevronLeft />
                    </button>
                    <div ref={similarRef} className="flex gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory w-full transition-transform duration-500 ease-in-out">
                        {movie.similarMovies.map((m) => (
                            <MovieCard key={m.id} movie={m} className="relative w-[32%] sm:w-[25%] md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group snap-start" />
                        ))}
                    </div>
                    <button onClick={() => scroll("right", "similar")} className="hidden lg:block absolute -right-8 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div className="my-6 lg:px-21">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Recommended Movies</h2>
                <div className="relative flex items-center">
                    <button onClick={() => scroll("left", "recommended")} className="hidden lg:block absolute -left-10 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
                        <ChevronLeft />
                    </button>
                    <div ref={recommendedRef} className="flex gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory w-full transition-transform duration-500 ease-in-out">
                        {movie.recommendedMovies.map((m) => (
                            <MovieCard key={m.id} movie={m} className="relative w-[32%] sm:w-[25%] md:w-48 md:h-72 lg:w-56 lg:h-80 flex-shrink-0 overflow-hidden group snap-start" />
                        ))}
                    </div>
                    <button onClick={() => scroll("right", "recommended")} className="hidden lg:block absolute -right-8 cursor-pointer z-10 bg-gray-800 p-2 rounded-full">
                        <ChevronRight />
                    </button>
                </div>
            </div>

        </div >
    );
};

export default FilmPage;
