import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getMoviePoster } from "../lib/poster";
import { Heart } from "lucide-react";
import { Star } from "lucide-react";


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

    if (!movie) return <div className="text-white text-center">Loading...</div>;

    console.log(reviews);
    return (
        <div>
        <div className="text-white px-10 py-6 flex gap-8">
            {/* Movie Poster */}
            <div className="w-1/4">
            <img src={getMoviePoster(movie.poster_path, "w500")} alt={movie.title} className="w-full rounded-lg" />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
                <h1 className="text-4xl font-bold">{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
                <p className="text-lg text-gray-400 mt-1">Directed by <span className="text-white">{movie.director}</span></p>
                <p className="mt-4 text-gray-200 font-medium">{movie.tagline}</p>
                <p className="mt-4 text-gray-400">{movie.overview}</p>

                <h2 className="text-xl mt-6">Cast</h2>
                <p className="text-gray-400">{movie.cast?.join(", ")}</p>
            </div>

            {/* Placeholder for rating, watched, log, review  */}
            <div className="w-1/4 bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-500">[Placeholder for Rating, Watched, Log, Review Form]</p>
            </div>
        </div>


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
                {review.liked && <p className="text-orange-400 "><Heart fill="currentColor" className="w-4 h-4"/></p>}
                </div>
                <p className={`text-gray-300 ${review.spoiler ? "bg-red-700 text-white p-2 rounded" : ""}`}>
                    {review.spoiler ? "⚠ Spoiler Hidden" : review.review}
                </p>
            </div>
        ))
    )}
</div>

</div>

    );
};

export default FilmPage;
