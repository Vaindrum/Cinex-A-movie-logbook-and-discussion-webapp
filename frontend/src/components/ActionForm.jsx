import { useState } from "react";
import { Eye, EyeOff, Heart, Bookmark, Star } from "lucide-react";

const ActionForm = ({ actions }) => {
  console.log(actions);
    const [watched, setWatched] = useState(actions.watched);
    const [liked, setLiked] = useState(actions.liked);
    const [watchlist, setWatchlist] = useState(actions.watchlisted);
    const [rating, setRating] = useState(actions.rating);

    const handleRatingClick = (newRating) => {
        setRating(newRating);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
                <button onClick={() => setWatched(!watched)}>
                    {watched ? <Eye className="text-green-400" /> : <EyeOff className="text-gray-500" />}
                </button>
                <button onClick={() => setLiked(!liked)}>
                    {liked ? <Heart fill="currentColor" className="text-red-500" /> : <Heart className="text-gray-500" />}
                </button>
                <button onClick={() => setWatchlist(!watchlist)}>
                    {watchlist ? <Bookmark fill="currentColor" className="text-blue-500" /> : <Bookmark className="text-gray-500" />}
                </button>
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                        key={num}
                        fill={num <= rating ? "currentColor" : "none"}
                        className={num <= rating ? "text-yellow-400" : "text-gray-500"}
                        onClick={() => handleRatingClick(num)}
                    />
                ))}
            </div>
            <button className="bg-gray-800 text-white px-4 py-2 rounded">Activity</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Review / Log</button>
        </div>
    );
};

export default ActionForm;
