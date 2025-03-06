import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim() === "") {
                setResults([]);
                return;
            }
            try {
                const res = await axiosInstance.get(`/movies/search?q=${query}`);
                setResults(res.data.results || []);
            } catch (error) {
                console.error("Error searching movies:", error.message);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (movie) => {
        // navigate(`/film/${movieName}`);
        navigate(`/film/${movie.title}${movie.release_date ? "-" + movie.release_date.split("-")[0] : ""}`);
        setQuery("");
        setShowDropdown(false);
    };

    return (
        <div className="relative w-72">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                }}
                placeholder="Search movies..."
                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring focus:ring-blue-500"
            />
            {showDropdown && results.length > 0 && (
                <ul className="absolute w-full bg-gray-800 text-white mt-1 rounded shadow-lg">
                    {results.slice(0,5).map((movie) => (
                        <li 
                            key={movie.id} 
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleSelect(movie)}
                        >
                            {movie.title} ({new Date(movie.release_date).getFullYear()})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
