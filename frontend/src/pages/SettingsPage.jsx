import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImage, setselectedImage] = useState(authUser.profilePic || "/avatar.png");
  const [formData, setformData] = useState({
    username: authUser.username,
    email: authUser.email,
    bio: authUser.bio || null,
    favourites: authUser.favourites || []
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setselectedImage(base64Image);

      try {
        await updateProfile({profilePic: base64Image });
      } catch (error) {
        console.error("Image upload failed:",error);
        setselectedImage(authUser.profilePic);
      }
    }

    reader.onerror = () => {
      toast.error("Error reading image");
    }
  };

  const handleChange = (e) => {
    setformData({...formData,[e.target.name]: e.target.value});
  };

  const handleFavouritesChange = (movieId) => {
    setformData((prev) => {
      const newFavourites = prev.favourites.includes(movieId)
      ? prev.favourites.filter((id) => id!== movieId)
      : [...prev.favourites.slice(0,3), movieId];
      return {...prev, favourites: newFavourites};
    });
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error("Profile Update Failed:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
                <label htmlFor="imageUpload" className="relative w-32 h-32 cursor-pointer">
                    <img
                        src={selectedImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-500"
                    />
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
                <p className="text-gray-400 text-sm mt-2">Click to change profile picture</p>
            </div>

            {/* Username */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Bio */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                ></textarea>
            </div>

            {/* Save Button */}
            <button
                onClick={handleUpdateProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
                disabled={isUpdatingProfile}
            >
                {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
        </div>
    );
};

export default SettingsPage
