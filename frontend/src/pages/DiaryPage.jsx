import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { axiosInstance } from '../lib/axios';
import { getMoviePoster } from '../lib/poster';
import { useAuthStore } from '../store/useAuthStore';
import UserCard from '../components/UserCard';

const DiaryPage = () => {
    const { username } = useParams();
    const { authUser } = useAuthStore();
    const [loading, setloading] = useState(true);
    const [logs, setlogs] = useState([]);
    const navigate = useNavigate();
    const [profilePic, setprofilePic] = useState(null);
    const [currentPage, setcurrentPage] = useState(1);
    const [totalLogs, settotalLogs] = useState(0);
    const limit = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axiosInstance.get(`/page/${username}/diary?page=${currentPage}`);
                setlogs(res.data.logs ? res.data.logs.sort((a,b) => new Date(b.watchedOn) - new Date(a.watchedOn)) : []);
                setprofilePic(res.data.profilePic || "/avatar.png");
                settotalLogs(res.data.totalLogs);
                console.log("Total Logs:", totalLogs, "Current Page:", currentPage, "Limit:", limit);
            } catch (error) {
                console.error("Error fetching Logs:", error)
            } finally {
                setloading(false);
            }
        };
        fetchLogs();
    }, [username, currentPage]);

    if (loading) return <Loading />;

    if (logs.length === 0) return (
        <div className='flex items-center justify-center h-screen'>
            <p>Logs Not Found</p>
        </div>
    )
    
      return (
        <div className="max-w-4xl mx-auto p-4">
        <UserCard username={username} profilePic={profilePic} />
          <h1 className="text-xl font-semibold mb-4">{username}'s Diary</h1>
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Day</th>
                  <th className="p-3">Film</th>
                  <th className="p-3">Released</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Like</th>
                  <th className="p-3">Rewatch</th>
                  <th className="p-3">Review</th>
                  {authUser?.username === username && <th className="p-3">Edit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {logs.map((log, index) => {
                  const date = new Date(log.watchedOn);
                  const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
                  return (
                    <tr key={log.logId} className="hover:bg-gray-800">
                      <td className="p-3">{monthYear}</td>
                      <td className="p-3">{date.getDate()}</td>
                      <td className="p-3 flex items-center cursor-pointer" onClick={() => navigate(`/film/${log.title.toLowerCase().replace(/\s+/g, "-")}${log.release_date ? "-" + log.release_date.split("-")[0] : ""}`)}>
                        <img src={getMoviePoster(log.poster_path)} alt={log.title} className="w-12 h-auto mr-2" />
                        {log.title}
                      </td>
                      <td className="p-3">{new Date(log.release_date).getFullYear()}</td>
                      <td className="p-3">{log.rating ?? "N/A"}</td>
                      <td className="p-3">{log.liked ? "❤️" : "—"}</td>
                      <td className="p-3">{log.rewatch ? "🔁" : "—"}</td>
                      <td className="p-3">{log.reviewId ? "✅" : "—"}</td>
                      {authUser?.username === username && (
                        <td className="p-3">
                          <button className="text-blue-400 hover:underline">Edit</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6 space-x-4 cursor-pointer">
                {currentPage > 1 && (
                    <button onClick={() => setcurrentPage(currentPage - 1)} className="px-4 py-2 bg-red-700 text-white rounded">Previous</button>
                )}
                {(currentPage * limit) < totalLogs && (
                    <button onClick={() => setcurrentPage(currentPage + 1)} className="px-4 py-2 bg-red-700 text-white rounded">Next</button>
                )}
            </div>
        </div>
      );
    };
    

export default DiaryPage
