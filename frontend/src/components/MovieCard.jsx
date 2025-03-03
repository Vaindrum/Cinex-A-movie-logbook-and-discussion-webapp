import { useNavigate } from "react-router-dom";
import { getMoviePoster } from "../lib/poster";

const MovieCard = ({ movie, className }) => {
    const navigate = useNavigate();
    const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A"; 

    return (
        <div
            className={`cursor-pointer ${className}`}
            onClick={() => navigate(`/film/${movie.id}`)}
        >
            <img src={getMoviePoster(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover rounded-xl transition duration-300 group-hover:opacity-50" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity">
                <h3 className="text-white text-sm sm:text-base md:text-lg font-bold text-center">{movie.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{year}</p>
            </div>
        </div>
    );
};

export default MovieCard;
