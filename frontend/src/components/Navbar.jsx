import React from 'react';
import { useNavigate } from "react-router-dom";
import { ClipboardX } from 'lucide-react';

const Navbar = ({setshowSignUp}) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between">
    <div className='cursor-pointer' onClick={() => navigate("/")}>
      <h1 className="text-xl font-extrabold">Cine<ClipboardX className='inline'/></h1>
    </div>
    <button onClick={() => setshowSignUp(true)} className="bg-blue-500 px-4 py-2  cursor-pointer">
      Sign Up
    </button>
  </nav>
  )
}

export default Navbar;
