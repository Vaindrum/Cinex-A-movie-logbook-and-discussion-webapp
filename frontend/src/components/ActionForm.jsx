import { useState } from "react";
import { Eye, EyeOff, Heart, Bookmark, Star } from "lucide-react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ActionForm = ({ movieId, username }) => {
  console.log(movieId, username);
  const [actions, setactions] = useState({ watched: false, liked: false, watchlisted: false, rating: null });

    const fetchActionStatus = async () => {
        try {
            const res = await axiosInstance.get(`/actions/${username}/${movieId}`);
            setactions(res.data);
            console.log("actions",username,res.data);
        } catch (error) {
            console.error("Error fetching actions status:", error.message);
        }
    };

    useEffect(() => {
        if (movieId) fetchActionStatus();
    }, [movieId]);

    const handleAction = async (type) => {
        try {
            await axiosInstance.post(`/actions/${type}/${movieId}`);
            toast.success(`${type} Updated`);
            fetchActionStatus();
        } catch (error) {
            toast.error(`Error updating ${type}`);
            console.error(`Error updating ${type}:`,error);
        }
    }

    const handleRating = async (newRating) => {
        try {
            await axiosInstance.post(`/actions/rate/${movieId}`, { rating: newRating });
            toast.success("Rating Updated");
            fetchActionStatus();
        } catch (error) {
            toast.error("Error in Updating Rating");
            console.error("Error updating rating:",error)
        }
    };

    const handleDeleteRating = async () => {
        try {
            await axiosInstance.delete(`/actions/rate/${movieId}`);
            toast.success("Rating Removed");
            fetchActionStatus();
        } catch (error) {
            toast.error("Error Removing Rating");
            console.error("Error deleting rating:", error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
                <button onClick={() => handleAction("watched")}>
                    {actions.watched ? <Eye className="text-green-400" /> : <EyeOff className="text-gray-500" />}
                </button>
                <button onClick={() => handleAction("like")}>
                    {actions.liked ? <Heart fill="currentColor" className="text-red-500" /> : <Heart className="text-gray-500" />}
                </button>
                <button onClick={() => handleAction("watchlist")}>
                    {actions.watchlisted ? <Bookmark fill="currentColor" className="text-blue-500" /> : <Bookmark className="text-gray-500" />}
                </button>
            </div>

            <div className="flex gap-1 items-center">
                {actions.rating !== null && (
                    <button onClick={handleDeleteRating} className="mr-2">
                        <X className="text-gray-500 hover:text-red-500" />
                    </button>
                )}
                {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                        key={num}
                        fill={num <= actions.rating ? "currentColor" : "none"}
                        className={num <= actions.rating ? "text-yellow-400" : "text-gray-500"}
                        onClick={() => handleRating(num)}
                    />
                ))}
            </div>

            <button className="bg-gray-800 text-white px-4 py-2 rounded">Activity</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Review / Log</button>
        </div>
    );
};


export default ActionForm;
