import { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import GoogleLoginButton from "../components/GoogleLoginButton";
import MainLayout from "../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { getTranslatedError } from "../utils/getTranslatedError";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, email, setEmail, setUser } = useAuth();

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
      Swal.fire({
        icon: "success",
        title: t("login.success_title"),
        text: t("login.success_message"),
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("login.error_title"),
        text: getTranslatedError(t, err)
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <MainLayout backgroundImage="/home-bg.png">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">{t("login.title")}</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder={t("profile.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder={t("profile.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            {submitting ? t("login.loading") : t("login.button")}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {t("login.no_account")}{" "}
          <Link to="/register" className="text-blue-600 underline">
            {t("login.register_link")}
          </Link>
        </p>

        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </div>
    </MainLayout>
  );
}
