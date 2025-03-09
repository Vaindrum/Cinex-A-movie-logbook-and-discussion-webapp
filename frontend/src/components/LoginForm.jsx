import React from 'react'

import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

import { Eye, EyeOff, X } from 'lucide-react'

const LoginForm = ({ setshowLogin, setshowSignUp }) => {
    const [showPassword, setshowPassword] = useState(false);
    const [formData, setformData] = useState({ username: "", password: "" });

    const { login, isLoggingIn } = useAuthStore();

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            toast.error("Username is required");
            return false;
        }
        if (!formData.password) {
            toast.error("Password is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const success = await login(formData);
        if (success) setshowLogin(false);
    }

    return (
        <div className='fixed top-0 z-50 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center' onClick={() => setshowLogin(false)}>
            <div className='bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-96 relative font-inter' onClick={(e) => e.stopPropagation()}>
                <button className='absolute top-2 right-2 text-gray-300 hover:text-white cursor-pointer' onClick={() => setshowLogin(false)}>
                    <X size={20} />
                </button>

                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <h2 className='text-2xl font-semibold mb-4 text-center'>Login</h2>

                    <input type="text" name="username" placeholder="Username" className="mb-2 p-2 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black" value={formData.username} onChange={handleChange} />

                    <div className='relative'>
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="mb-4 p-2 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black pr-10" value={formData.password} onChange={handleChange} />
                        <button type="button" className="absolute right-3 top-3 text-gray-500 hover:text-white cursor-pointer" onClick={() => setshowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-fit cursor-pointer hover:bg-green-600" disabled={isLoggingIn}>
                        {isLoggingIn ? "Logging In..." : "Log In"}
                    </button>
                    <p className="text-sm mt-2 text-gray-400">
                        Don't have an account?
                        <span
                            className="text-green-400 cursor-pointer hover:underline ml-1"
                            onClick={() => {
                                setshowLogin(false);
                                setshowSignUp(true);
                            }}>
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
