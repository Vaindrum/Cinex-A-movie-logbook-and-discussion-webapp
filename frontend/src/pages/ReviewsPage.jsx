import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star,StarHalf, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import { getMoviePoster } from '../lib/poster';
import UserCard from '../components/UserCard';

const ReviewsPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [reviews, setreviews] = useState([]);
  const [profilePic, setprofilePic] = useState(null);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalReviews, settotalReviews] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/page/${username}/reviews?page=${currentPage}`);
        setreviews(res.data.reviews ? res.data.reviews.sort((a, b) => new Date(b.watchedOn || b.createdAt) - new Date(a.watchedOn || a.createdAt)) : []);
        setprofilePic(res.data.profilePic || "/avatar.png");
        settotalReviews(res.data.totalReviews);
      } catch (error) {
        console.error("Error fetching Reviews:", error.message);
      } finally {
        setloading(false);
      }
    };
    fetchReviews();
  }, [username, currentPage]);

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

  if (reviews.length === 0) return (
    <div className="max-w-4xl mx-auto p-4">
    <UserCard username={username} profilePic={profilePic} />
    <div className='flex items-center justify-center h-screen'>
      <p className="text-gray-400 text-lg">No Reviews Yet</p>
    </div>
    </div>
  );

  return (
    <div className="max-w-4xl min-h-dvh mx-auto p-4">
      <UserCard username={username} profilePic={profilePic} />
      <h1 className="text-xl font-semibold text-white mb-4">{username}'s Reviews</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
            <div className="flex items-start space-x-4">
              <img src={getMoviePoster(review.poster_path)} alt={review.title} className="w-16 h-auto cursor-pointer rounded-lg" onClick={() => navigate(`/${username}/review/${review.reviewId}`)}/>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white cursor-pointer" onClick={() => navigate(`/${username}/review/${review.reviewId}`)}>
                  {review.title} ({new Date(review.release_date).getFullYear()})
                </h2>
                <p className="text-xs text-gray-400">
                  {review.rewatch ? "Rewatched" : "Watched"} on {new Date(review.watchedOn || review.createdAt).toDateString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {review.rating !== null && renderStars(review.rating)}
                  {review.liked && <Heart size={16} className="text-red-500 fill-red-500" />}
                </div>
                <p className="mt-2 text-sm text-gray-300">{review.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        {currentPage > 1 && (
          <button onClick={() => setcurrentPage(currentPage - 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
            <ArrowLeft size={16} /> Previous
          </button>
        )}
        {(currentPage * limit) < totalReviews && (
          <button onClick={() => setcurrentPage(currentPage + 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
