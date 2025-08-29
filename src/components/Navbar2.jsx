import { useState } from "react";
import { Link } from "react-router-dom";
import { User,Film } from "lucide-react";


export default function Navbar(currentUser) {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full z-50 top-0 left-0 bg-gray-900/70 backdrop-blur-md shadow-md md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand + Favorite Button */}
          <div className="flex items-center gap-1 self-start ml-4">
            <Link to="/">
              <h1 className="text-2xl md:text-3xl font-extrabold text-red-600 ">
                CineSearch
              </h1>
            </Link>
            <button className="text-2xl text-gray-200 hover:text-red-600 transition">
              <Film className="w-6 h-6 text-pink-500" />
            </button>
          </div>

          {/* Search Input + Button */}
          
        </div>
      
          <div
            className="absolute top-4 right-6 cursor-pointer"
            onClick={() => setOpenMenu(true)}
          >
            <svg
              className="fill-red-600"
              xmlns="http://www.w3.org/2000/svg"
              height="34px"
              viewBox="0 -960 960 960"
              width="34px"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </div>
        
      </nav>

      {/* FULL-SCREEN LOGIN/SIGNUP MENU */}
    <div
  className={`fixed transition duration-300 inset-0 bg-gray-950 flex flex-col items-center justify-center space-y-6 z-60 ${
    openMenu ? "translate-y-[0%]" : "translate-y-[-100%]"
  }`}
      >
        
        {currentUser && <Link to="/my-account" onClick={() => setOpenMenu(false)}>
            <div className="flex items-center space-x-1 md:mr-8">
              <User className="w-6 h-6 text-red-700" />
              <span className="font-medium text-white">My Account</span>
            </div>
        </Link>}
        
        <Link
    onClick={() => setOpenMenu(false)}
    to="/"
    className="text-white text-lg font-medium hover:text-red-500 transition duration-300 cursor-pointer"
  >
    Home
  </Link>
  {/* About */}
  <Link
    onClick={() => setOpenMenu(false)}
    to="/about"
    className="text-white text-lg font-medium hover:text-red-500 transition duration-300 cursor-pointer"
  >
    About
        </Link>
        

  {/* Contact */}
  <Link
    onClick={() => setOpenMenu(false)}
    to="/contact"
    className="text-white text-lg font-medium hover:text-red-500 transition duration-300 cursor-pointer"
  >
    Contact
  </Link>

  {/* Login CTA */}
  {!currentUser && <Link
    onClick={() => setOpenMenu(false)}
    to="/login"
    className="bg-red-600 py-3 px-8 rounded-full hover:bg-red-500 text-white font-semibold text-lg w-40 text-center shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer active:scale-[0.95]"
  >
    Login
  </Link>}

  {/* Signup CTA */}
  {!currentUser && <Link
    onClick={() => setOpenMenu(false)}
    to="/signup"
    className="bg-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-500 text-white font-semibold text-lg w-40 text-center shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer active:scale-[0.95]"
  >
    Sign Up
  </Link>}

  {/* Close Button */}
  <div
    className="absolute top-6 right-6 cursor-pointer"
    onClick={() => setOpenMenu(false)}
  >
    <svg
      className="fill-red-600"
      xmlns="http://www.w3.org/2000/svg"
      height="34px"
      viewBox="0 -960 960 960"
      width="34px"
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  </div>
</div>


      
    </>
  );
}


  

