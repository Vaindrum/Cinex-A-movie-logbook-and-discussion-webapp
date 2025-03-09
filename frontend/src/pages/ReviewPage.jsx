import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getMoviePoster } from "../lib/poster";
import { useAuthStore } from "../store/useAuthStore";
import LogForm from "../components/LogForm";
import Loading from "../components/Loading";
import { MessageSquare, Trash2, Edit, Heart, Star, StarHalf} from "lucide-react";
import toast from "react-hot-toast";

const ReviewPage = () => {
    const { authUser } = useAuthStore();
    const { username, reviewId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState(null);
    const [profilePic, setProfilePic] = useState("/avatar.png");
    const [formData, setFormData] = useState({ reviewId, comment: "" });
    const [showLogForm, setShowLogForm] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const fetchReview = async () => {
        try {
            const res = await axiosInstance.get(`/page/${username}/review/${reviewId}`);
            setReview(res.data || null);
            setProfilePic(res.data.profilePic || "/avatar.png");
        } catch (error) {
            console.error("Error fetching review:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [username, reviewId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if(!authUser){
            toast.error("Login to write comments");
            return;
        }
        try {
            await axiosInstance.post("/actions/comment", formData);
            setFormData({ ...formData, comment: "" });
            fetchReview();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosInstance.delete("/actions/comment", { data: { commentId } });
            fetchReview();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

     const renderStars = (rating) => {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
        
            return (
                <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(fullStars)].map((_, i) => <Star key={i} size={16} fill="currentColor" stroke="none" />)}
                    {hasHalfStar && <StarHalf size={16} fill="currentColor" stroke="none" />}
                </div>
            );
        };

    if (loading) return <Loading />;
    if (!review) return <div className="flex items-center justify-center h-screen">Review Not Found</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg shadow-md">
                <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/${username}/profile`)} />
                <h1 className="text-lg">Review by <span className="font-semibold cursor-pointer" onClick={() => navigate(`/${username}/profile`)}>{username}</span></h1>
            </div>

            <div className="border border-gray-700 bg-gray-900 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <img src={getMoviePoster(review.poster_path)} alt={review.title} className="w-16 h-24 cursor-pointer rounded" onClick={() => navigate(`/film/${review.title}`)} />
                    <div>
                        <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/film/${review.title}`)}>{review.title} ({new Date(review.release_date).getFullYear()})</h2>
                        <p className="flex gap-3 my-4 ">
                            {review.rating !== null && (
                                <>
                                    {renderStars(review.rating)}
                                </>
                            )} {review.liked && <Heart size={16} className="text-red-500 fill-red-500" />}
                            </p>
                            <p className="text-xs text-gray-400">
                            {review.rewatch ? "Rewatched" : "Watched"} on {new Date(review.watchedOn || review.createdAt).toDateString()}
                        </p>
                    </div>
                </div>
                {authUser?.userId === review.userId && (
                <button onClick={() => setShowLogForm(true)} className="mt-2 flex items-center cursor-pointer text-blue-400 hover:text-blue-300"><Edit size={16} className="mr-1" />
                Edit
                </button>)}
                {review.review && <p className="mt-2 text-sm text-gray-300">{review.review}</p>}
            </div>

            <div className="border border-gray-700 bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold">Comments</h2>
                {review.comments.length === 0 ? (
                    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                ) : (
                    <div className="mt-2 space-y-3">
                        {review.comments.map((comment) => (
                            <div key={comment.commentId} className="flex items-start gap-4 border-b border-gray-700 pb-3">
                                <img
                                    src={comment.profilePic || "/avatar.png"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full cursor-pointer"
                                    onClick={() => navigate(`/${comment.username}/profile`)}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{comment.username}</p>
                                    <p className="text-sm text-gray-300">{comment.comment}</p>
                                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toDateString()}</p>
                                </div>
                                {comment.username === authUser.username && (
                                    <button onClick={() => handleDeleteComment(comment.commentId)}>
                                        <Trash2 size={16} className="text-red-400 cursor-pointer hover:text-red-300" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleCommentSubmit} className="border border-gray-700 bg-gray-900 rounded-lg p-4 space-y-2">
                <h3 className="text-lg font-semibold">Add a Comment</h3>
                <textarea
                    name="comment"
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                    rows="3"
                    placeholder="Write a comment..."
                    value={formData.comment}
                    onChange={handleChange}
                />
                <button type="submit" className="flex items-center cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    <MessageSquare size={16} className="mr-1" /> Post Comment
                </button>
            </form>

            {showLogForm && (
                <LogForm
                    setshowLogForm={setShowLogForm}
                    watchedOnChecked={!!review.logId}
                    rewatchChecked={review.rewatch}
                    movieId={review.movieId}
                    username={username}
                    reviewId={reviewId}
                    review={review.review}
                    rating={review.rating}
                    liked={review.liked}
                    logId={review.logId}
                    watchedOn={review.watchedOn}
                />
            )}
        </div>
    );
};

export default ReviewPage;
