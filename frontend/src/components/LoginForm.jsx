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

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}auth/google`;
    };
    

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
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="mb-4 p-2 w-7/8 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black pr-10" value={formData.password} onChange={handleChange} />
                        <button type="button" className="absolute right-3 top-3 text-gray-500 hover:text-white cursor-pointer" onClick={() => setshowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-fit cursor-pointer hover:bg-green-600" disabled={isLoggingIn}>
                        {isLoggingIn ? "Logging In..." : "Log In"}
                    </button>
                </form>

                    <div className='mt-4'>
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg transition duration-200 "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button>
                    </div>
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
            </div>
        </div>
    )
}

export default LoginForm
