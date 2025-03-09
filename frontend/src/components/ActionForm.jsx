import { useState } from "react";
import { Eye, EyeOff, Heart, Bookmark, Star } from "lucide-react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import LogForm from "./LogForm";
import StarRatingSlider from "./StarRatingSlider";

const ActionForm = ({ movieId, username, authUser }) => {
  console.log(movieId, username);
  const [actions, setactions] = useState({ watched: false, liked: false, watchlisted: false });
  const [rating, setRating] = useState(null);
  const [showLogForm, setshowLogForm] = useState(false);

  const fetchActionStatus = async () => {
    try {
      const res = await axiosInstance.get(`/actions/${username}/${movieId}`);
      setactions(res.data);
      console.log("actions", username, res.data);
    } catch (error) {
      console.error("Error fetching actions status:", error.message);
    }
  };

  useEffect(() => {
    if (movieId){
      const timer = setTimeout(fetchActionStatus, 1000); // Wait 1s before fetching
      return () => clearTimeout(timer);
    }
  }, [movieId, showLogForm]);

  const handleAction = async (type) => {
    try {
      await axiosInstance.post(`/actions/${type}/${movieId}`);
      toast.success(`${type} Updated`);
      fetchActionStatus();
    } catch (error) {
      toast.error(`Error updating ${type}`);
      console.error(`Error updating ${type}:`, error);
    }
  }

  const handleRating = async (rating) => {
    try {
      await axiosInstance.post(`/actions/rate/${movieId}`, { rating: rating });
      toast.success("Rating Updated");
      fetchActionStatus();
    } catch (error) {
      toast.error("Error in Updating Rating");
      console.error("Error updating rating:", error)
    }
  };

  const handleDeleteRating = async () => {
    try {
      await axiosInstance.delete(`/actions/rate/${movieId}`);
      toast.success("Rating Removed");
      setRating(null);
      fetchActionStatus();
    } catch (error) {
      toast.error("Error Removing Rating");
      console.error("Error deleting rating:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button className="cursor-pointer" onClick={() => {
          if (authUser) {
            handleAction("watched");
          } else {
            toast.error(`Login to mark Watched`);
          }
        }}>
          {actions.watched ? <Eye className="text-green-400" /> : <EyeOff className="text-gray-500" />}
        </button>
        <button className="cursor-pointer" onClick={() => {
          if (authUser) {
            handleAction("like");
          } else {
            toast.error(`Login to Like`);
          }
        }}>
          {actions.liked ? <Heart fill="currentColor" className="text-red-500" /> : <Heart className="text-gray-500" />}
        </button>
        <button className="cursor-pointer" onClick={() => {
          if (authUser) {
            handleAction("watchlist");
          } else {
            toast.error(`Login to add to Watchlist`);
          }
        }}>
          {actions.watchlisted ? <Bookmark fill="currentColor" className="text-blue-500" /> : <Bookmark className="text-gray-500" />}
        </button>
      </div>

      <div className="flex gap-1 items-center cursor-pointer">
        {rating !== null && (
          <button onClick={handleDeleteRating} className="mr-2">
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        )}

        <StarRatingSlider
          rating={rating}
          setRating={(newRating) => {
            if (authUser) {
              setRating(newRating);
              handleRating(newRating); // Trigger API call when user selects a rating
            } else {
              toast.error("Login to add Rating");
            }
          }}
        />

      </div>

      <button className="bg-gray-800 text-white px-4 py-2 rounded">Activity</button>
      <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded" onClick={() => {
        if (authUser) {
          setshowLogForm(true);
        } else {
          toast(`Login to Create Logs / Write Reviews`);
        }
      }}>Review / Log</button>
      {showLogForm && <LogForm setshowLogForm={setshowLogForm} movieId={movieId} username={username} />}
    </div>
  );
};


export default ActionForm;
