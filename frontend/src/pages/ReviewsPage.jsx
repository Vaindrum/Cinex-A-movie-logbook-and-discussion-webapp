import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import { getMoviePoster } from '../lib/poster';
import UserCard from '../components/UserCard';


const ReviewsPage = () => {
  const { username} = useParams();
  const [loading, setloading] = useState(true);
  const [reviews, setreviews] = useState([]);
  const navigate = useNavigate();
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
        console.log("Total Reviews:", totalReviews, "Current Page:", currentPage, "Limit:", limit);
        // console.log("Fetched Review:", res.data);
      } catch (error) {
        console.error("Error fetching Reviews:", error.message);
      } finally {
        setloading(false);
      }
    };
    fetchReviews();
  }, [username,currentPage]);



  if (loading) return <Loading />;

  if (reviews.length === 0) return (
    <div className='flex items-center justify-center h-screen'>
      <p>Reviews Not Found</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4">
      <UserCard username={username} profilePic={profilePic} />
      <h1 className="text-xl font-semibold mb-4">{username}'s Reviews</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img src={getMoviePoster(review.poster_path)} alt={review.title} className="w-16 h-auto cursor-pointer" onClick={() => navigate(`/${username}/review/${review.reviewId}`)}/>
              <div>
                <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/${username}/review/${review.reviewId}`)}>{review.title} ({new Date(review.release_date).getFullYear()})</h2>
                <p className="text-sm">{review.rating ?? "N/A"} ★ | {review.liked ? "❤️" : "—"}</p>
                <p className="text-xs text-gray-400">{review.rewatch ? "Rewatched" : "Watched"} on {new Date(review.watchedOn || review.createdAt).toDateString()}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{review.review}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-4 cursor-pointer">
                {currentPage > 1 && (
                    <button onClick={() => setcurrentPage(currentPage - 1)} className="px-4 py-2 bg-red-700 text-white rounded">Previous</button>
                )}
                {(currentPage * limit) < totalReviews && (
                    <button onClick={() => setcurrentPage(currentPage + 1)} className="px-4 py-2 bg-red-700 text-white rounded">Next</button>
                )}
            </div>
    </div>
  );
};

export default ReviewsPage
