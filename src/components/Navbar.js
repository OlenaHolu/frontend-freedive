import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full bg-black bg-opacity-80 text-white py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-lg font-bold">Freedive Analyzer</div>

      {/* Menu for grand screens */}
      <div className="hidden md:flex space-x-6">
        <a href="/" className="hover:underline">Home</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/leaderboard" className="hover:underline">Leaderboard</a>
        <a href="/community" className="hover:underline">Community</a>
        <a href="/about" className="hover:underline">About Us</a>
      </div>

      <button 
        className="hidden md:block bg-gray-900 px-4 py-2 rounded-lg border border-white"
        onClick={() => navigate("/login")}
      >
        Login
      </button>

        {/* Hamburger menu for mobile */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

        {/* Menu for mobile */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center py-4 space-y-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/leaderboard" className="hover:underline">Leaderboard</a>
          <a href="/community" className="hover:underline">Community</a>
          <a href="/about" className="hover:underline">About Us</a>
          <button 
            className="bg-gray-900 px-4 py-2 rounded-lg border border-white"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
