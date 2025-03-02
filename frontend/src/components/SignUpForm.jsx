import React from 'react'

import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"

import { Eye, EyeOff, X } from "lucide-react";

const SignUpForm = ({ setshowSignUp }) => {
    const [showPassword, setshowPassword] = useState(false);
    const [formData, setformData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
  
    const { signup, isSigningUp } = useAuthStore();
  
    const handleChange = (e) => {
      setformData({ ...formData, [e.target.name]: e.target.value }); // ✅ Fix: Removed brackets around e.target.value
    };
  
    const validateForm = () => {
      return !formData.username || !formData.email || !formData.password; // ✅ Fix: Now returns true when fields are empty
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        setError("Please fill in all fields"); // ✅ Fix: Show error if fields are empty
        return;
      }
      setError(""); 
      await signup(formData);
      setshowSignUp(false);
    };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setshowSignUp(false)}>
      <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-96 relative font-inter" onClick={(e) => e.stopPropagation()}>
        {/* Close Button (X) */}
        <button className="absolute top-2 right-2 text-gray-300 hover:text-white cursor-pointer" onClick={() => setshowSignUp(false)}>
          <X size={20} />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>} {/* ✅ Fix: Display error message */}

          <input type="text" name="username" placeholder="Username" className="mb-2 p-2 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black" value={formData.username} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" className="mb-2 p-2 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black" value={formData.email} onChange={handleChange} />

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="mb-4 p-2 border border-gray-500 bg-gray-300 text-black rounded-md focus:bg-white focus:text-black pr-10" value={formData.password} onChange={handleChange} />
            <button type="button" className="absolute right-3 top-3 text-gray-500 hover:text-white cursor-pointer" onClick={() => setshowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-fit cursor-pointer hover:bg-green-600" disabled={isSigningUp}>
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;