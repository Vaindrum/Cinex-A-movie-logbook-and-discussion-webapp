import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ username, profilePic }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-700 transition mb-4">
      <img
        src={profilePic || "/avatar.png"}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
        onClick={() => navigate(`/${username}/profile`)}
      />
      <span
        className="text-white text-lg font-medium cursor-pointer whitespace-nowrap truncate max-w-[120px] sm:max-w-none"
        onClick={() => navigate(`/${username}/profile`)}
      >
        {username.includes(" ") ? username.split(" ")[0] : username}
      </span>

      <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base font-light ml-auto mr-2">
        {["films", "diary", "reviews", "watchlist", "likes"].map((item) => (
          <p
            key={item}
            onClick={() => navigate(`/${username}/${item}`)}
            className="cursor-pointer transition-all duration-200 hover:text-gray-300"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </p>
        ))}
      </nav>
    </div>
  );
};

export default UserCard;
