import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/Loading";
import ImageModal from "../components/ImageModal";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${username}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Error in fetching User:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading) return <Loading />;
  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User Not Found</p>
      </div>
    );

  return (
    <div className="max-w-3xl min-h-dvh mx-auto p-6">
      {/* Desktop Layout */}
      <div className="hidden  sm:flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img
            src={profile.profilePic || "/avatar.png"}
            alt="Profile"
            className="cursor-pointer w-24 h-24 rounded-full object-cover"
            onClick={() => setModalOpen(true)}
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-500 text-sm">
              Joined on {new Date(profile.createdAt).toDateString()}
            </p>
            <p className="mt-2 text-sm">{profile.bio || "No bio available"}</p>
          </div>
        </div>
        {authUser?.username === profile.username && (
          <button
            onClick={() => navigate(`/${authUser.username}/settings`)}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
         <ImageModal 
                isOpen={modalOpen} 
                imageUrl={profile.profilePic} 
                onClose={() => setModalOpen(false)}
            />
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden flex flex-col items-center text-center">
        <img
          src={profile.profilePic || "/avatar.png"}
          alt="Profile"
          className="cursor-pointer w-24 h-24 rounded-full object-cover border"
          onClick={() => setModalOpen(true)}
        />
        <h1 className="mt-3 text-xl font-bold">{profile.username}</h1>
        <p className="text-gray-500 text-sm">
          Joined on {new Date(profile.createdAt).toDateString()}
        </p>
        <p className="mt-2 text-sm px-4">{profile.bio || "No bio available"}</p>
        {authUser?.username === profile.username && (
          <button
            onClick={() => navigate(`/${authUser.username}/settings`)}
            className="cursor-pointer mt-3 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
         <ImageModal 
                isOpen={modalOpen} 
                imageUrl={profile.profilePic} 
                onClose={() => setModalOpen(false)}
            />
      </div>

      {/* Followers / Following */}
      <div className="mt-6 flex justify-center sm:justify-start gap-6 text-center">
        <div>
          <p className="text-xl font-bold">{profile.followers.length}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="text-xl font-bold">{profile.following.length}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>

      {/* Mini Navbar */}
      <nav className="mt-6 bg-gray-900 p-4 text-white">
        {/* Desktop: Horizontal */}
        <div className="hidden sm:flex justify-center gap-6 text-sm font-light">
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

        {/* Mobile: Vertical */}
        <div className="sm:hidden flex flex-col items-center gap-3 text-sm font-light">
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
};

export default ProfilePage;
