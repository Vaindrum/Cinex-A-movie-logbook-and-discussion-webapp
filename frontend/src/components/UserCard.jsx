import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ username, profilePic }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition mb-4" >
      <img 
        src={profilePic || "/avatar.png"} 
        alt="Profile" 
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
        onClick={() => navigate(`/${username}/profile`)}
      />
      <span className="text-white text-lg font-medium cursor-pointer" onClick={() => navigate(`/${username}/profile`)}>{username}</span>
      <nav className=" p-4 text-white flex justify-between items-center">
        <div className="ml-4 flex justify-center gap-10 text-sm sm:text-base font-light">
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

export default UserCard;
