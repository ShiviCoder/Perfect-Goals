import { useState } from "react";
import { Link } from "react-router-dom";
import PGLogo from "../assets/PG.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50"
      style={{ backgroundColor: "rgb(215, 223, 239)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={PGLogo}
              alt="logo"
              className="h-11 w-11 rounded-full"
            />
            <span className="font-bold text-lg text-blue-800 whitespace-nowrap">
              Perfect Your Goal
            </span>
          </Link>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-semibold transition">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition">About</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-semibold transition">Services</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition">Contact</a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              LOGIN
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center text-gray-300 bg-blue-600 p-2 rounded"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <a href="#home" className="block px-4 py-3 hover:bg-blue-50">Home</a>
          <a href="#about" className="block px-4 py-3 hover:bg-blue-50">About</a>
          <a href="#services" className="block px-4 py-3 hover:bg-blue-50">Services</a>
          <a href="#contact" className="block px-4 py-3 hover:bg-blue-50">Contact</a>
          <Link to="/registration" className="block px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-b-md hover:bg-blue-700">
            REGISTER HERE
          </Link>
        </div>
      )}
    </nav>
  );
}
