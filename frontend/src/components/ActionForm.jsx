import { useState, useEffect } from "react";
import { Eye, EyeOff, Heart, Bookmark, Star, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import LogForm from "./LogForm";
import StarRatingSlider from "./StarRatingSlider";

const ActionForm = ({ movieId, username, authUser }) => {
  console.log(movieId, username);
  const [actions, setActions] = useState({ watched: false, liked: false, watchlisted: false });
  const [rating, setRating] = useState(null);
  const [showLogForm, setshowLogForm] = useState(false);
  const [loading, setLoading] = useState({ watched: false, liked: false, watchlisted: false, rating: false });

  const fetchActionStatus = async () => {
    try {
      const res = await axiosInstance.get(`/actions/${username}/${movieId}`);
      setActions(res.data);
      console.log("actions", username, res.data);
    } catch (error) {
      console.error("Error fetching actions status:", error.message);
    }
  };

  useEffect(() => {
    if (movieId) {
      const timer = setTimeout(fetchActionStatus, 1000); // Wait 1s before fetching
      return () => clearTimeout(timer);
    }
  }, [movieId, showLogForm]);

  const handleAction = async (type) => {
    if (loading[type]) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      await axiosInstance.post(`/actions/${type}/${movieId}`);
      toast.success(`${type} Updated`);
      fetchActionStatus();
    } catch (error) {
      toast.error(`Error updating ${type}`);
      console.error(`Error updating ${type}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRating = async (newRating) => {
    if (loading.rating) return;
    setLoading((prev) => ({ ...prev, rating: true }));

    try {
      await axiosInstance.post(`/actions/rate/${movieId}`, { rating: newRating });
      toast.success("Rating Updated");
      fetchActionStatus();
    } catch (error) {
      toast.error("Error in Updating Rating");
      console.error("Error updating rating:", error);
    } finally {
      setLoading((prev) => ({ ...prev, rating: false }));
    }
  };

  const handleDeleteRating = async () => {
    if (loading.rating) return;
    setLoading((prev) => ({ ...prev, rating: true }));

    try {
      await axiosInstance.delete(`/actions/rate/${movieId}`);
      toast.success("Rating Removed");
      setRating(null);
      fetchActionStatus();
    } catch (error) {
      toast.error("Error Removing Rating");
      console.error("Error deleting rating:", error);
    } finally {
      setLoading((prev) => ({ ...prev, rating: false }));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button
          className="cursor-pointer"
          disabled={loading.watched}
          onClick={() => {
            if (authUser) handleAction("watched");
            else toast.error(`Login to mark Watched`);
          }}
        >
          {actions.watched ? <Eye className="text-green-400" /> : <EyeOff className="text-gray-500" />}
        </button>

        <button
          className="cursor-pointer"
          disabled={loading.liked}
          onClick={() => {
            if (authUser) handleAction("like");
            else toast.error(`Login to Like`);
          }}
        >
          {actions.liked ? <Heart fill="currentColor" className="text-orange-500" /> : <Heart className="text-gray-500" />}
        </button>

        <button
          className="cursor-pointer"
          disabled={loading.watchlisted}
          onClick={() => {
            if (authUser) handleAction("watchlist");
            else toast.error(`Login to add to Watchlist`);
          }}
        >
          {actions.watchlisted ? <Bookmark fill="currentColor" className="text-blue-500" /> : <Bookmark className="text-gray-500" />}
        </button>
      </div>

      <div className="flex gap-1 items-center cursor-pointer">
        {rating !== null && (
          <button onClick={handleDeleteRating} className="mr-2" disabled={loading.rating}>
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        )}

        <StarRatingSlider
          rating={rating}
          setRating={(newRating) => {
            if (authUser) {
              setRating(newRating);
              handleRating(newRating);
            } else {
              toast.error("Login to add Rating");
            }
          }}
        />
      </div>

      <button className="bg-gray-800 text-white px-4 py-2 rounded">Activity</button>

      <button
        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => {
          if (authUser) setshowLogForm(true);
          else toast.error(`Login to Create Logs / Write Reviews`);
        }}
      >
        Review / Log
      </button>

      {showLogForm && <LogForm setshowLogForm={setshowLogForm} movieId={movieId} username={username} />}
    </div>
  );
};

export default ActionForm;
