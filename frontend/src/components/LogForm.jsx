import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";
import { Star, StarHalf } from "lucide-react";
import StarRatingSlider from "./StarRatingSlider";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Heart } from "lucide-react";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    // console.log("Log form", watchedOnChecked, rating, review, liked, initialRewatchChecked, logId, reviewId, watchedOn);


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
        if (isSubmitting) return;
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-[32rem] text-gray-300 transition-all scale-95">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                        {watchedOnChecked ? "Log a movie..." : "Write a review..."}
                    </h2>
                    <button
                        onClick={() => setshowLogForm(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
                        disabled={isSubmitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Form */}
                <div className="space-y-6">
                    {/* Watch Date Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={watchedOnChecked}
                                    onChange={() => setWatchedOnChecked(!watchedOnChecked)}
                                    className="w-4 h-4 accent-gray-300 rounded border-gray-600"
                                    disabled={isSubmitting}
                                />
                                <label className="text-base font-medium">
                                    {watchedOnChecked ? "Watched on" : "Log a movie?"}
                                </label>
                            </div>

                            {watchedOnChecked && (
                                <input
                                    type="date"
                                    value={watchedOn}
                                    onChange={(e) => setWatchedOn(e.target.value)}
                                    placeholder={!initialWatchedOn ? "dd-mm-yyyy" : initialWatchedOn}
                                    className="w-28 p-1 text-sm border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={isSubmitting}
                                />
                            )}
                        </div>

                        {watchedOnChecked && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={rewatchChecked}
                                    onChange={() => setRewatchChecked(!rewatchChecked)}
                                    className="w-4 h-4 accent-gray-300 rounded border-gray-600"
                                    disabled={isSubmitting}
                                />
                                <label className="text-base font-medium">Rewatch</label>
                            </div>
                        )}
                    </div>

                    {/* Review Section */}
                    <div>
                        <textarea
                            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                            placeholder="Write your thoughts about the film..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Rating, Like, and Action Buttons Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {rating !== null && (
                                <button 
                                    onClick={() => setRating(null)} 
                                    className="p-0.5 text-gray-500 hover:text-red-500 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    <X size={21} />
                                </button>
                            )}
                            <StarRatingSlider rating={rating} setRating={setRating} />
                            <button
                                className={`px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                                    liked 
                                        ? "text-orange-500" 
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                                onClick={() => setLiked(!liked)}
                                disabled={isSubmitting}
                            >
                                <Heart size={30} className={liked ? "fill-current" : ""} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {(logId || reviewId) && (
                                <button
                                    className={`bg-red-800 cursor-pointer text-white px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                                    }`}
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            )}
                            <button
                                className={`bg-green-700 cursor-pointer text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                                }`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogForm;
