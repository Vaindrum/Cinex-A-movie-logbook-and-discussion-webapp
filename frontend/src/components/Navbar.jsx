import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ClipboardX, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import SearchBar from './SearchBar';
import toast from 'react-hot-toast';

const Navbar = ({ setshowSignUp, setshowLogin, setshowLogout }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-3 text-white w-full z-50">
      {/* Mobile Hamburger Button */}
      <button className="lg:hidden" onClick={() => setDrawerOpen(true)}>
        <Menu className="w-8 h-8" />
      </button>

 {/* Left: SearchBar (only on mobile) */}
 <div className="flex items-center ml-4 gap-2 w-full lg:hidden">
    <SearchBar className="w-full" />
  </div>


      {/* Logo */}
      <div className='cursor-pointer sm:ml-0 ml-auto' onClick={() => navigate("/")}>
        <h1 className="text-xl font-extrabold flex items-center gap-0">Cine<ClipboardX className='inline' /></h1>
      </div>



      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-center gap-6 text-sm sm:text-base font-medium">
        {["films", "diary", "reviews", "watchlist", "likes"].map((item) => (
          <p
            key={item}
            onClick={() => {
              if (authUser) {
                navigate(`/${authUser.username}/${item}`);
              } else {
                toast.error(`Login to view your ${item}`);
                setshowLogin(true);
              }
            }}
            className="cursor-pointer transition-all duration-200 hover:text-gray-300"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </p>
        ))}
      </div>

      {/* Search Bar (Only on Large Screens) */}
      <div className="hidden lg:block">
        <SearchBar />
      </div>

      {/* Profile & Auth Buttons */}
      {authUser ? (
        <div className="hidden lg:flex items-center gap-4 cursor-pointer">
          <img src={authUser.profilePic || "/avatar.png"} alt="Profile" className="w-10 h-10 rounded-full" onClick={() => navigate(`/${authUser.username}/profile`)} />
          <p onClick={() => navigate(`/${authUser.username}/profile`)}>{authUser.username}</p>
          <button onClick={() => setshowLogout(true)} className="bg-red-500 px-4 py-2 rounded cursor-pointer">
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden lg:flex gap-4">
          <button onClick={() => setshowSignUp(true)} className="bg-blue-500 px-4 py-2 cursor-pointer">
            Sign Up
          </button>
          <button onClick={() => setshowLogin(true)} className="bg-blue-500 px-4 py-2 cursor-pointer">
            Login
          </button>
        </div>
      )}

      {/* Mobile Drawer (Sliding Navbar) */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 h-full p-6 text-white">
            <button className="mb-4" onClick={() => setDrawerOpen(false)}>
              <X className="w-6 h-6" />
            </button>

            {/* Profile */}
            {authUser && (
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => {
                navigate(`/${authUser.username}/profile`);
                setDrawerOpen(false);
              }}>
                <img src={authUser.profilePic || "/avatar.png"} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="text-lg font-bold">{authUser.username}</p>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
              <p className="cursor-pointer" onClick={() => { navigate("/"); setDrawerOpen(false); }}>Home</p>
              {authUser ? (
                <>
                  <p className="cursor-pointer" onClick={() => { navigate(`/${authUser.username}/profile`); setDrawerOpen(false); }}>Profile</p>
                  {["films", "diary", "reviews", "watchlist", "likes", "settings"].map((item) => (
                    <p key={item} onClick={() => { navigate(`/${authUser.username}/${item}`); setDrawerOpen(false); }} className="cursor-pointer">
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {["films", "diary", "reviews", "watchlist", "likes","settings"].map((item) => (
                    <p key={item} onClick={() => {
                      toast.error(`Login to view your ${item}`);
                      setshowLogin(true);
                      setDrawerOpen(false);
                    }} className="cursor-pointer">
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </p>
                  ))}
                </>
              )}

              {/* <p className="cursor-pointer" onClick={() => { navigate("/settings"); setDrawerOpen(false); }}>Settings</p> */}
              {authUser ? (
                <p className="cursor-pointer text-red-500" onClick={() => { setshowLogout(true); setDrawerOpen(false); }}>Log Out</p>
              ) : (
                <>
                  <p className="cursor-pointer text-blue-400" onClick={() => { setshowSignUp(true); setDrawerOpen(false); }}>Sign Up</p>
                  <p className="cursor-pointer text-blue-400" onClick={() => { setshowLogin(true); setDrawerOpen(false); }}>Login</p>
                </>
              )}
            </nav>
          </div>

          {/* Click outside to close drawer */}
          <div className="flex-1" onClick={() => setDrawerOpen(false)}></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
