import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = () => {
    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo válido.");
      return;
    }
    navigate("/register");
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      {/* Navbar Reutilizable */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center md:items-start justify-center h-full px-6 md:px-12 text-white text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-bold">FREEDIVE <br /> ANALYZER</h1>
        <p className="text-md md:text-lg mt-2">Discover the depths!</p>

        {/* Email Input */}
        <div className="mt-6 w-full max-w-xs">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full p-3 text-black rounded-lg"
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full max-w-xs">
          <button 
            className="bg-white text-black px-6 py-3 rounded-lg font-bold w-full"
            onClick={handleSignIn}
          >
            SIGN IN to TRACK
          </button>
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold w-full"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        className="absolute bottom-6 right-6 md:top-1/3 md:right-8 bg-white text-black w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg"
        onClick={() => navigate("/login")}
      >
        +
      </button>
    </div>
  );
};

export default Home;
