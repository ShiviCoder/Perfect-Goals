import { useState } from "react";
import { Link } from "react-router-dom";
import PGLogo from "../assets/PG.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="bg-[#D7DFEF] border-b border-gray-300 fixed w-full top-0 left-0 z-50 shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={PGLogo} alt="logo" className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg text-blue-800 whitespace-nowrap">
              Perfect Your Goal
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-semibold transition">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition">
              About
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-semibold transition">
              Services
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition">
              Contact
            </a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              LOGIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center text-white bg-blue-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {menuOpen ? (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <a href="#home" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-blue-50">
          Home
        </a>
        <a href="#about" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-blue-50">
          About
        </a>
        <a href="#services" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-blue-50">
          Services
        </a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-blue-50">
          Contact
        </a>
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="block px-4 py-3 bg-blue-600 text-white text-center font-semibold hover:bg-blue-700 transition"
        >
          LOGIN HERE
        </Link>
      </div>
    </nav>
  );
}
