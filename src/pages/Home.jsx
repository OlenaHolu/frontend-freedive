import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { email, setEmail } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = () => {
    if (!validateEmail(email)) {
      setError(t("invalidEmail"));
      return;
    }
    navigate("/register");
  };

  return (
    <MainLayout>
      <h1 className="text-5xl md:text-6xl font-bold">FREEDIVE <br /> ANALYZER</h1>
      <p className="text-md md:text-lg mt-2">{t("discover")}</p>

      {/* Email Input */}
      <div className="mt-6 w-full max-w-xs">
        <input
          type="email"
          placeholder={t("enterEmail")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full p-3 text-black rounded-lg"
        />
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>

      <div className="mt-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full max-w-xs">
        <button
          className="bg-white text-black px-6 py-3 rounded-lg font-bold w-full"
          onClick={handleSignIn}
        >
          {t("signIn.title")}
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold w-full"
          onClick={() => navigate("/login")}
        >
          {t("login.title")}
        </button>
      </div>

      {/* Floating Button */}
      <button
        className="absolute bottom-6 right-6 md:top-1/3 md:right-8 bg-white text-black w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg"
        onClick={() => navigate("/login")}
      >
        +
      </button>
    </MainLayout>
  );
};

export default Home;
