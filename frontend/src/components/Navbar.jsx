import React from 'react';
import { useNavigate } from "react-router-dom";
import { ClipboardX } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ProfilePage from '../pages/ProfilePage';

const Navbar = ({ setshowSignUp, setshowLogin }) => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center">
      <div className='cursor-pointer' onClick={() => navigate("/")}>
        <h1 className="text-xl font-extrabold">Cine<ClipboardX className='inline' /></h1>
      </div>
      <div className="flex justify-center gap-6 text-sm sm:text-base font-medium">
        {["films", "diary", "reviews", "watchlist", "likes"].map((item) => (
          <p
            key={item}
            onClick={() => navigate(`/${authUser.username}/${item}`)}
            className="cursor-pointer transition-all duration-200 hover:text-gray-300"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </p>
        ))}
      </div>

      {authUser ? (
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/${authUser.username}/profile`)}>
          <img src={authUser.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
          <p>{authUser.username}</p>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded cursor-pointer">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button onClick={() => setshowSignUp(true)} className="bg-blue-500 px-4 py-2 cursor-pointer">
            Sign Up
          </button>
          <button onClick={() => setshowLogin(true)} className="bg-blue-500 px-4 py-2 cursor-pointer">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
