import React from 'react';
import { useNavigate } from "react-router-dom";
import { ClipboardX } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ProfilePage from '../pages/ProfilePage';
import SearchBar from './Searchbar';
import LoginForm from './LoginForm';
import toast from 'react-hot-toast';

const Navbar = ({ setshowSignUp, setshowLogin, setshowLogout }) => {
  const navigate = useNavigate();
  const { authUser} = useAuthStore();

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-3 text-white w-full z-50">
      <div className='cursor-pointer' onClick={() => navigate("/")}>
        <h1 className="text-xl font-extrabold">Cine<ClipboardX className='inline' /></h1>
      </div>
      <div className="flex justify-center gap-6 text-sm sm:text-base font-medium">
        {["films", "diary", "reviews", "watchlist", "likes"].map((item) => (
          <p
            key={item}
            onClick={() => {
              if (authUser) {
                navigate(`/${authUser.username}/${item}`);
              } else {
                toast(`Login to view your ${item}`);
                setshowLogin(true);
              }
            }}            
            className="cursor-pointer transition-all duration-200 hover:text-gray-300"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </p>
        ))}
      </div>
<SearchBar />
      {authUser ? (
        <div className="flex items-center gap-4 cursor-pointer">
          <img src={authUser.profilePic || "/avatar.png"} alt="Profile" className="w-10 h-10 rounded-full" onClick={() => navigate(`/${authUser.username}/profile`)} />
          <p onClick={() => navigate(`/${authUser.username}/profile`)}>{authUser.username}</p>
          <button onClick={() => setshowLogout(true)} className="bg-red-500 px-4 py-2 rounded cursor-pointer">
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
