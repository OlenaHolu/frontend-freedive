import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet";

const Home = () => {
  const { email, setEmail } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, ready } = useTranslation(undefined, {useSuspense: false});

    if (!ready) {
        return (
          <MainLayout>
            <div className="text-center py-20 text-gray-600 text-lg font-medium">
              {t("loading")}
            </div>
          </MainLayout>
        );   
      }

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = () => {
    if (!validateEmail(email)) {
      setError(t("profile.invalid_email"));
      return;
    }
    navigate("/register");
  };

  return (
    <MainLayout backgroundImage="/home-bg.png">
       <Helmet>
        <title>{t("app_title")}</title> 
        <meta name="description" content={t("app_description")} />
        <meta property="og:title" content={t("app_title")} />
        <meta property="og:description" content={t("app_description")} />
        <meta property="og:url" content="https://frontend-freedive.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <h1 className="text-5xl md:text-6xl font-bold">FREEDIVE <br /> ANALYZER</h1>
      <p className="text-md md:text-lg mt-2">{t("discover")}</p>

      {/* Email Input */}
      <div className="mt-6 w-full max-w-xs">
        <input
          type="email"
          placeholder={t("profile.email_placeholder")}
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
          onClick={handleRegister}
        >
          {t("register.title")}
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold w-full"
          onClick={() => navigate("/login")}
        >
          {t("login.title")}
        </button>
      </div>

    </MainLayout>
  );
};

export default Home; 
