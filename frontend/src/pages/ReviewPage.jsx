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
    const navigate = useNavigate();

    console.log(review);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/review/${reviewId}`);
                setreview(res.data || null);
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
            <h1 className="text-xl font-semibold">Review by {username}</h1>
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
        </div>
    );
};


export default ReviewPage
