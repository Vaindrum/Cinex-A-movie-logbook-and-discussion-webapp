import React from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const LogoutPrompt = ({ setshowLogout }) => {
    const { logout, isLoggingOut } = useAuthStore();
    const navigate = useNavigate();
    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setshowLogout(false)}>
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96" onClick={(e) => e.stopPropagation()}>
                <button className='absolute top-2 right-2 text-gray-300 hover:text-white cursor-pointer' onClick={() => setshowLogout(false)}>
                    <X size={20} />
                </button>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setshowLogout(false)} className="bg-gray-500 px-4 cursor-pointer py-2 rounded-md">Cancel</button>
                    <button onClick={() => {
                        logout();
                        setshowLogout(false);
                        navigate("/");
                    }} className="bg-red-500 px-4 py-2 cursor-pointer rounded-md" disabled={isLoggingOut}>{isLoggingOut ? "Logging Out..." : "Log Out"}</button>
                </div>
            </div>
        </div>
    )
}

export default LogoutPrompt
