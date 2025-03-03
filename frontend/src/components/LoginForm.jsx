import React from 'react'

import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

import { Eye, EyeOff, X } from 'lucide-react'

const LoginForm = ({setshowLogin}) => {
    const [showPassword, setshowPassword] = useState(false);
    const [formData, setformData] = useState({username:"", password:""});
    const [error, seterror] = useState("");

    const {login, isLoggingIn} = useAuthStore();

    const handleChange = (e) => {
        setformData({ ...formData,[e.target.name]: e.target.value});
    };

    const validateForm = () => {
        return !formData.username || !formData.password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateForm()){
            seterror("Please fill in all the fields");
            return;
        }
        seterror("");
        await login(formData);
        setshowLogin(false);
    }

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center' onClick={() => setshowLogin(false)}>
        <div className='bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-96 relative font-inter' onClick={(e) => e.stopPropagation()}>
            <button className='absolute top-2 right-2 text-gray-300 hover:text-white cursor-pointer' onClick={() => setshowLogin(false)}>
                <X size={20}/>
            </button>

            <form onSubmit={handleSubmit} className='flex flex-col'>
                <h2 className='text-2xl font-semibold mb-4 text-center'>Login</h2>

                {error && <p className='text-red-500'>{error}</p>}

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
            </form>
        </div>
    </div>
  )
}

export default LoginForm
