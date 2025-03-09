import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import { useAuthStore } from './store/useAuthStore';

import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import FilmPage from './pages/FilmPage';
import FilmsPage from './pages/FilmsPage';
import LikesPage from './pages/LikesPage';
import WatchlistPage from './pages/WatchlistPage';
import ReviewsPage from './pages/ReviewsPage';
import DiaryPage from './pages/DiaryPage';
import Loading from './components/Loading';
import ReviewPage from './pages/ReviewPage';
import LogoutPrompt from './components/LogoutPrompt';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [showSignUp, setshowSignUp] = useState(false);
  const [showLogin, setshowLogin] = useState(false);
  const [showLogout, setshowLogout] = useState(false);

  // checkAuth on every refresh
  useEffect(() => {
    checkAuth();
  }, []);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) return <Loading />;


  return (
    <div>
      <Navbar setshowSignUp={setshowSignUp} setshowLogin={setshowLogin} setshowLogout={setshowLogout} className="fixed top-0 left-0 w-full z-50 bg-black shadow-md" />
      <div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              marginTop: "60px", // Adjust based on navbar height
            },
          }} />

        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/:username/settings' element={<SettingsPage />} />
          <Route path='/:username/profile' element={<ProfilePage />} />
          <Route path='/film/:movieName' element={<FilmPage />} />

          <Route path='/:username/films' element={<FilmsPage />} />
          <Route path='/:username/likes' element={<LikesPage />} />
          <Route path='/:username/watchlist' element={<WatchlistPage />} />
          <Route path='/:username/reviews' element={<ReviewsPage />} />
          <Route path='/:username/diary' element={<DiaryPage />} />

          <Route path='/:username/review/:reviewId' element={<ReviewPage />} />

        </Routes>
        {showSignUp && <SignUpForm setshowSignUp={setshowSignUp} setshowLogin={setshowLogin} />}
        {showLogin && <LoginForm setshowLogin={setshowLogin} setshowSignUp={setshowSignUp} />}
        {showLogout && <LogoutPrompt setshowLogout={setshowLogout} />}
      </div>
    </div>
  )
}

export default App;
