import React from 'react'

const Navbar = ({setshowSignUp}) => {
  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between">
    <h1 className="text-xl">Cinex</h1>
    <button onClick={() => setshowSignUp(true)} className="bg-blue-500 px-4 py-2  cursor-pointer">
      Sign Up
    </button>
  </nav>
  )
}

export default Navbar;
