import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import { getMoviePoster } from '../lib/poster';
import { useAuthStore } from '../store/useAuthStore';
import UserCard from '../components/UserCard';
import LogForm from '../components/LogForm';
import { Star, StarHalf, Pencil, Heart, RefreshCcw, ArrowLeft, ArrowRight, MessageSquareText } from 'lucide-react';

const DiaryPage = () => {
  const { username } = useParams();
  const { authUser } = useAuthStore();
  const [loading, setloading] = useState(true);
  const [logs, setlogs] = useState([]);
  const navigate = useNavigate();
  const [profilePic, setprofilePic] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, settotalLogs] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get(`/page/${username}/diary?page=${currentPage}`);
        setlogs(
          res.data.logs
            ? res.data.logs.sort((a, b) => new Date(b.watchedOn) - new Date(a.watchedOn))
            : []
        );
        setprofilePic(res.data.profilePic || "/avatar.png");
        settotalLogs(res.data.totalLogs);
        console.log("Total Logs:", res.data.totalLogs, "Current Page:", currentPage, "Limit:", limit);
      } catch (error) {
        console.error("Error fetching Logs:", error);
      } finally {
        setloading(false);
      }
    };
    fetchLogs();
  }, [username, currentPage]);

  if (loading) return <Loading />;

  if (logs.length === 0) return (
    <div className="max-w-4xl mx-auto p-4">
        <UserCard username={username} profilePic={profilePic} />
        <div className='flex items-center justify-center h-screen'>
            <p className="text-gray-400 text-lg">No Logs Yet</p>
        </div>
    </div>
);

  // Group logs by month and year based on watchedOn date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.watchedOn);
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(log);
    return acc;
  }, {});

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

  return (
    <div className="max-w-4xl min-h-dvh mx-auto p-4">
      <UserCard username={username} profilePic={profilePic} />
      <h1 className="text-xl font-semibold mb-4">{username}'s Diary</h1>

      {/* Header row - hidden on mobile */}
      <div className="hidden md:grid grid-cols-11 gap-2 font-semibold text-white bg-gray-700 p-2 rounded-lg mb-4">
        <div className="text-center">Month</div>
        <div className="text-center">Day</div>
        <div className="text-center">Film</div>
        <div className="col-span-2 text-center"></div>
        <div className="text-center">Released</div>
        <div className="text-center">Rating</div>
        <div className="text-center">Liked</div>
        <div className="text-center">Reviewed</div>
        <div className="text-center">Rewatched</div>
        {authUser?.username === username && (<div className="text-center">Edit</div>)}
      </div>

      {/* Render grouped logs */}
      <div className="space-y-6">
        {Object.entries(groupedLogs).map(([monthYear, logs]) => (
          <div key={monthYear}>
            {/* Month Heading - Mobile */}
            <h2 className="md:hidden text-xl font-semibold text-white mb-4">{monthYear}</h2>
            
            {/* Logs for this month */}
            <div className="space-y-4">
              {logs.map((log, index) => {
                const logDate = new Date(log.watchedOn);
                const day = logDate.getDate();
                return (
                  <>
                    {/* Mobile Card Layout */}
                    <div
                      key={log.logId}
                      className="md:hidden border border-gray-600 rounded-lg p-4 bg-gray-800"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Date Square */}
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                          <span className="text-lg font-semibold text-white">{day}</span>
                        </div>

                        {/* Poster */}
                        <img
                          src={getMoviePoster(log.poster_path)}
                          alt={log.title}
                          className="w-16 h-auto rounded-lg cursor-pointer"
                          onClick={() => navigate(`/film/${log.title}`)}
                        />

                        {/* Content */}
                        <div className="flex-1">
                          {/* Title and Year */}
                          <h3 
                            className="text-lg font-semibold text-white cursor-pointer"
                            onClick={() => navigate(`/film/${log.title}`)}
                          >
                            {log.title} ({log.release_date ? new Date(log.release_date).getFullYear() : ""})
                          </h3>

                          {/* Icons Row */}
                          <div className="flex items-center gap-4 mt-2">
                            {/* Rating */}
                            {log.rating !== null && renderStars(log.rating)}

                            {/* Like */}
                            {log.liked && <Heart className="text-red-500 fill-red-500" size={16} />}

                            {/* Review */}
                            {log.reviewId && (
                              <MessageSquareText 
                                className='cursor-pointer' 
                                size={16} 
                                onClick={() => navigate(`/${username}/review/${log.reviewId}`)} 
                              />
                            )}

                            {/* Rewatch */}
                            {log.rewatch && <RefreshCcw size={16} />}

                            {/* Edit Button */}
                            {authUser?.username === username && (
                              <button 
                                onClick={() => setEditingLog(log)} 
                                className="ml-auto text-blue-400 cursor-pointer hover:text-blue-300"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div
                      key={`desktop-${log.logId}`}
                      className="hidden md:grid grid-cols-11 gap-2 items-center bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
                    >
                      <div className="text-center text-white">{index === 0 ? monthYear : ""}</div>
                      <div className="text-center text-gray-400">{day}</div>
                      <div className="text-center">
                        <img
                          src={getMoviePoster(log.poster_path)}
                          alt={log.title}
                          className="w-12 h-auto mx-auto rounded cursor-pointer"
                          onClick={() => navigate(`/film/${log.title}`)}
                        />
                      </div>
                      <div className="col-span-2 text-left text-white cursor-pointer" onClick={() => navigate(`/film/${log.title}`)}>
                        {log.title}
                      </div>
                      <div className="text-center text-gray-400">
                        {log.release_date ? new Date(log.release_date).getFullYear() : ""}
                      </div>
                      <div className="text-center">
                        {log.rating !== null && renderStars(log.rating)}
                      </div>
                      <div className="text-center pl-4">
                        {log.liked ? <Heart className="text-red-500 fill-red-500" size={16} /> : ""}
                      </div>
                      <div className="text-center pl-4">
                        {log.reviewId ? (
                          <MessageSquareText 
                            className='cursor-pointer' 
                            size={16} 
                            onClick={() => navigate(`/${username}/review/${log.reviewId}`)} 
                          />
                        ) : ""}
                      </div>
                      <div className="text-center pl-4">
                        {log.rewatch ? <RefreshCcw size={16} /> : ""}
                      </div>
                      <div className="text-center">
                        {authUser?.username === username && (
                          <button 
                            onClick={() => setEditingLog(log)} 
                            className="text-blue-400 cursor-pointer hover:text-blue-300"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
                   {currentPage > 1 && (
                     <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
                       <ArrowLeft size={16} /> Previous
                     </button>
                   )}
                   {(currentPage * limit) < totalLogs && (
                     <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
                       Next <ArrowRight size={16} />
                     </button>
                   )}
                 </div>

      {/* Edit Log Modal */}
      {editingLog && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg">
            <LogForm
              setshowLogForm={() => setEditingLog(null)}
              liked={editingLog.liked}
              rating={editingLog.rating}
              rewatchChecked={editingLog.rewatch}
              reviewId={editingLog.reviewId}
              review={editingLog.review}
              movieId={editingLog.movieId}
              username={username}
              logId={editingLog.logId}
              watchedOnChecked={true}
              watchedOn={editingLog.watchedOn}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
