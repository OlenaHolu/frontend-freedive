import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet";
import { BookOpenCheck, BarChartBig, Languages } from "lucide-react";

const Home = () => {
  const { email, setEmail } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, ready } = useTranslation(undefined, { useSuspense: false });

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

  <div className="w-full max-w-6xl mx-auto mt-16 px-4 flex flex-col md:flex-row items-start justify-between">
    {/* Izquierda: título e input */}
    <div className="w-full md:w-1/2 text-left">
      <h1 className="text-5xl md:text-6xl font-bold mb-2">FREEDIVE<br />ANALYZER</h1>
      <p className="text-md md:text-lg text-gray-100 mb-6">{t("discover")}</p>

      {/* Email Input */}
      <div className="w-full max-w-sm">
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

      {/* Botones */}
      <div className="mt-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full max-w-sm">
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
    </div>

    {/* Derecha: Descripción general */}
    <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-12 text-gray-100 bg-gray-600 bg-opacity-20 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{t("what_is_this") || "¿Qué es FreediveAnalyzer?"}</h2>
      <p className="text-md leading-relaxed">
  {t("home_description")}
</p>

    </div>
    </div>

      {/* Enlace para saber más */}
      <p
        className="text-sm mt-6 text-blue-200 underline cursor-pointer"
        onClick={() => navigate("/about")}
      >
        {t("learn_more")}
      </p>

      {/* Características destacadas */}
<div className="mt-16 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
  {/* Registro de inmersiones */}
  <div className="flex flex-col items-center  bg-gray-600 bg-opacity-20 rounded-lg p-6">
    <BookOpenCheck size={48} className="text-white mb-4" />
    <h3 className="text-lg font-semibold text-white">{t("feature_log")}</h3>
    <p className="text-sm text-gray-300 mt-2 leading-relaxed">
      {t("feature_log_description")}
    </p>
  </div>

  {/* Estadísticas visuales */}
  <div className="flex flex-col items-center  bg-gray-600 bg-opacity-20 rounded-lg p-6">
    <BarChartBig size={48} className="text-white mb-4" />
    <h3 className="text-lg font-semibold text-white">{t("feature_stats")}</h3>
    <p className="text-sm text-gray-300 mt-2 leading-relaxed">
      {t("feature_stats_description")}
    </p>
  </div>

  {/* Soporte multilingüe */}
  <div className="flex flex-col items-center  bg-gray-600 bg-opacity-20 rounded-lg p-6">
    <Languages size={48} className="text-white mb-4" />
    <h3 className="text-lg font-semibold text-white">{t("feature_langs")}</h3>
    <p className="text-sm text-gray-300 mt-2 leading-relaxed ">
      {t("feature_langs_description")}
    </p>
  </div>
</div>
      
    </MainLayout>
  );
};

export default Home;
