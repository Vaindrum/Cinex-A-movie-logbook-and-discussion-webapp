import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";
import { Star, StarHalf } from "lucide-react";
import StarRatingSlider from "./StarRatingSlider";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const LogForm = ({ setshowLogForm, movieId, username, review: initialReview, reviewId: initialReviewId, logId: initialLogId, liked: initialLiked, rating: initialRating, rewatchChecked: initialRewatchChecked, watchedOnChecked: initialwatchedOnChecked, watchedOn: initialWatchedOn }) => {
    const [watchedOnChecked, setWatchedOnChecked] = useState(initialwatchedOnChecked ?? true);
    const [rewatchChecked, setRewatchChecked] = useState(initialRewatchChecked || false);
    const [rating, setRating] = useState(initialRating || null);
    const [liked, setLiked] = useState(initialLiked || false);
    const [review, setReview] = useState(initialReview || "");
    const [logId, setlogId] = useState(initialLogId || null);
    const [reviewId, setreviewId] = useState(initialReviewId || null);
    const [watchedOn, setWatchedOn] = useState(
        initialWatchedOn ? initialWatchedOn.split("T")[0] : new Date().toISOString().split("T")[0]
    );
    console.log("Log form", watchedOnChecked, rating, review, liked, initialRewatchChecked, logId, reviewId, watchedOn);


    useEffect(() => {
        const loadActions = async () => {
            try {
                const res = await axiosInstance.get(`/actions/${username}/${movieId}`);
                if (initialRating == null) {
                    setRating(res.data?.rating || null);
                }
                setLiked(res.data?.liked || false);
                console.log("Use effect data", res.data);
            } catch (error) {
                console.error("Error fetching actions:", error);
            }
        };
        const timer = setTimeout(loadActions, 1000); // Wait 1s before fetching
    return () => clearTimeout(timer);
        
    }, []);

    const handleSubmit = async () => {
        try {
            const data = {
                review: review.trim(),
                rating,
                liked,
            };
            // console.log("Log form",watchedOnChecked, rating,review,liked, initialRewatchChecked, logId, reviewId, watchedOn);

            if (watchedOnChecked) {
                // Log mode: We want to create or update a log.
                data.watchedOn = watchedOn;
                data.rewatch = rewatchChecked;

                // Conversion: if this was originally a review, delete it first.
                if (reviewId && !logId) {
                    await axiosInstance.delete(`/actions/review/${movieId}`, { data: { reviewId } });
                    await axiosInstance.post(`/actions/log/${movieId}`, data);
                    toast.success("Converted review to log!");
                } else if (logId) {
                    // Update existing log.
                    await axiosInstance.put(`/actions/log/${movieId}`, { logId, ...data });
                    toast.success("Log updated!");
                } else {
                    // No existing entry: create a new log.
                    await axiosInstance.post(`/actions/log/${movieId}`, data);
                    toast.success("Log added!");
                }
            } else {
                // Review mode: We want to create or update a review.
                // Conversion: if this was originally a log, delete it first.
                if (logId) {
                    await axiosInstance.delete(`/actions/log/${movieId}`, { data: { logId } });
                    await axiosInstance.post(`/actions/review/${movieId}`, data);
                    toast.success("Converted log to review!");
                } else if (reviewId) {
                    // Update existing review.
                    await axiosInstance.put(`/actions/review/${movieId}`, { reviewId, ...data });
                    toast.success("Review updated!");
                } else {
                    // No existing entry: create a new review.
                    await axiosInstance.post(`/actions/review/${movieId}`, data);
                    toast.success("Review added!");
                }
            }
            setshowLogForm(false);
        } catch (error) {
            console.error("Error submitting:", error);
            toast.error("Something went wrong. Try again.");
        }
    };


    const handleDelete = async () => {
        try {
            console.log(watchedOnChecked, logId, reviewId)
            if (watchedOnChecked && logId) {
                await axiosInstance.delete(`/actions/log/${movieId}`, { data: { logId } });
                toast.success("Log Deleted!");
            }
            else if (!watchedOnChecked && reviewId) {
                await axiosInstance.delete(`/actions/review/${movieId}`, { data: { reviewId } });
                toast.success("Review Deleted");
            }
            setshowLogForm(false);
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete entry")
        }
    };

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 text-gray-300 transition-all scale-95">
                <h2 className="text-xl font-semibold mb-4 text-white text-center">
                    {logId || reviewId ? "Edit Log / Review" : "Log / Review"}
                </h2>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={watchedOnChecked}
                        onChange={() => setWatchedOnChecked(!watchedOnChecked)}
                        className="accent-blue-500"
                    />
                    <label>Watched on date</label>
                </div>

                {watchedOnChecked && (
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="date"
                            value={watchedOn}
                            onChange={(e) => setWatchedOn(e.target.value)}
                            placeholder={!initialWatchedOn ? "dd-mm-yyyy" : initialWatchedOn}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        />
                        <input
                            type="checkbox"
                            checked={rewatchChecked}
                            onChange={() => setRewatchChecked(!rewatchChecked)}
                            className="accent-blue-500"
                        />
                        <label>Rewatch?</label>
                    </div>
                )}

                <textarea
                    className="w-full p-3 border border-gray-600 rounded mt-3 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <div className="flex gap-1 items-center cursor-pointer">
                    {rating !== null && (
                        <button onClick={() => setRating(null)} className="mr-2">
                            <X className="text-gray-500 hover:text-red-500" />
                        </button>
                    )}
                    <StarRatingSlider rating={rating} setRating={setRating} />
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className={`px-4 py-2 rounded-lg transition-all ${liked ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        onClick={() => setLiked(!liked)}
                    >
                        {liked ? "❤️ Liked" : "♡ Like"}
                    </button>

                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                        onClick={handleSubmit}
                    >
                        {logId || reviewId ? "Update" : "Submit"}
                    </button>
                </div>

                {(logId || reviewId) && (
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all mt-3 w-full flex items-center justify-center gap-2"
                        onClick={handleDelete}
                    >
                        <Trash2 size={16} />
                        Delete Entry
                    </button>
                )}

                <button
                    className="text-gray-400 mt-4 block text-center w-full hover:text-white transition-all"
                    onClick={() => setshowLogForm(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default LogForm;
