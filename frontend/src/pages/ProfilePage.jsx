import React, { useEffect } from 'react'
import { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Loading from '../components/Loading';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setprofile] = useState(null);
  const [loading, setloading] = useState(true);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${username}`);
        setprofile(res.data);
      } catch (error) {
        console.error("Error in fetching User:", error.message);
      } finally {
        setloading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading) return <Loading />;

  if (!profile) return (
    <div className='flex items-center justify-center h-screen'>
      <p>User Not Found</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profile.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-500">Joined on {new Date(profile.createdAt).toDateString()}</p>
          </div>
        </div>

        {/* Edit Profile Button - Only if authUser matches the profile */}
        {authUser?.username === profile.username && (
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Bio */}
      <p className="mt-4">{profile.bio || "No bio available"}</p>

      {/* Followers / Following */}
      <div className="mt-6 flex gap-6 text-center">
        <div>
          <p className="text-xl font-bold">{profile.followers.length}</p>
          <p className="text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-xl font-bold">{profile.following.length}</p>
          <p className="text-gray-500">Following</p>
        </div>
      </div>
      {/* Mini Navbar */}
      <nav className="bg-gray-900 p-4 text-white flex justify-between items-center">
        <div className="flex justify-center gap-6 text-sm sm:text-base font-light">
          {["films", "diary", "reviews", "watchlist", "likes"].map((item) => (
            <p
              key={item}
              onClick={() => navigate(`/${username}/${item}`)}
              className="cursor-pointer transition-all duration-200 hover:text-gray-300"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </p>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default ProfilePage;
