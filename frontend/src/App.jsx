import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import { useAuthStore } from './store/useAuthStore';

import {Loader} from "lucide-react";
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import FilmPage from './pages/FilmPage';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const [showSignUp, setshowSignUp] = useState(false);
  const [showLogin, setshowLogin] = useState(false);

  // checkAuth on every refresh
  useEffect(() => {
    checkAuth();
  }, []);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )
  

  return (
    <div>
      <Navbar setshowSignUp={setshowSignUp} setshowLogin={setshowLogin}/>

      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} /> */}
        <Route path='/settings' element={authUser ? <SettingsPage/>: <Navigate to="/login" />} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
        <Route path='/film/:movieId' element={ <FilmPage/> } />

      </Routes>

      {showSignUp && <SignUpForm setshowSignUp={setshowSignUp} />}
      {showLogin && <LoginForm setshowLogin={setshowLogin} />}

    </div>
  )
}

export default App;
