import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

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

const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const [showSignUp, setshowSignUp] = useState(false);
  const [showLogin, setshowLogin] = useState(false);

  // checkAuth on every refresh
  useEffect(() => {
    checkAuth();
  }, []);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return <Loading />;
  

  return (
    <div>
      <Navbar setshowSignUp={setshowSignUp} setshowLogin={setshowLogin}/>

      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/settings' element={authUser ? <SettingsPage/>: <Navigate to="/login" />} />
        <Route path='/:username/profile' element={ <ProfilePage/>} />
        <Route path='/film/:movieName' element={ <FilmPage/> } />

        <Route path='/:username/films' element={<FilmsPage/>}/>
        <Route path='/:username/likes' element={<LikesPage/>}/>
        <Route path='/:username/watchlist' element={<WatchlistPage/>}/>
        <Route path='/:username/reviews' element={<ReviewsPage/>}/>
        <Route path='/:username/diary' element={<DiaryPage/>}/>

        <Route path='/:username/review/:reviewId' element={<ReviewPage/>}/>


      </Routes>

      {showSignUp && <SignUpForm setshowSignUp={setshowSignUp} />}
      {showLogin && <LoginForm setshowLogin={setshowLogin} />}

    </div>
  )
}

export default App;
