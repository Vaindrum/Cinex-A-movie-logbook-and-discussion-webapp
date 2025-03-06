import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { getMoviePoster } from '../lib/poster';

const ReviewPage = () => {
    const { username, reviewId } = useParams();
    const [loading, setloading] = useState(true);
    const [review, setreview] = useState([]);
    const [profilePic, setprofilePic] = useState(null);
    const navigate = useNavigate();

    console.log(review);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/review/${reviewId}`);
                setreview(res.data || null);
                setprofilePic(res.data.profilePic || "/default-avatar.png");
            } catch (error) {
                console.error("Error fetching Review:", error.message);
            } finally {
                setloading(false);
            }
        };
        fetchReview();
    }, [username, reviewId]);


    if (loading) return <Loading />;

    if (review.length === 0) return (
        <div className='flex items-center justify-center h-screen'>
            <p>Review Not Found</p>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-3 p-3 rounded-lg mb-4" >

                <img
                    src={profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/${username}/profile`)}
                />
                <h1 className="text-xl font-normal">Review by</h1>
                <h1 className="text-xl font-semibold cursor-pointer " onClick={() => navigate(`/${username}/profile`)}>{username}</h1>
            </div>
            <div className="border border-gray-600 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-4">
                    <img src={getMoviePoster(review.poster_path)} alt={review.title} className="w-16 h- cursor-pointer" onClick={() => navigate(`/film/${review.title}`)} />
                    <div>
                        <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/film/${review.title}`)} >{review.title} ({new Date(review.release_date).getFullYear()})</h2>
                        <p className="text-sm">{review.rating ?? "N/A"} ★ | {review.liked ? "❤️" : "—"}</p>
                        <p className="text-xs text-gray-400">
                            {review.watchedOn ? `(Watched${review.rewatch ? "/Rewatched" : ""} on ${new Date(review.watchedOn).toDateString()})` : `(Review Added on ${new Date(review.createdAt).toDateString()})`}
                        </p>
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-300">{review.review}</p>
            </div>


            {/* Comments Section */}
            <div className="border border-gray-600 rounded-lg p-4 mt-4">
                <h2 className="text-lg font-semibold">Comments</h2>
                {review.comments.length === 0 ? (
                    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                ) : (
                    <div className="mt-2 space-y-2">
                        {review.comments.map((comment) => (
                            <div key={comment.commentId} className="border-b border-gray-700 pb-2">
                                <p className="text-sm font-semibold">{comment.username}</p>
                                <p className="text-sm text-gray-300">{comment.comment}</p>
                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Comment Form */}
                {/* <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea 
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500" 
                    rows="3" 
                    placeholder="Add a comment..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Post Comment
                </button>
            </form> */}
            </div>
        </div>
    );
};


export default ReviewPage
