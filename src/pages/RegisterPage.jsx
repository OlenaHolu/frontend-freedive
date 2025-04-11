import React, { use, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from '../components/GoogleLoginButton';
import MainLayout from '../layouts/MainLayout';
import { t } from 'i18next';
import { getTranslatedError } from '../utils/getTranslatedError';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { email, setEmail } = useAuth();
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Redirección automática si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await register(name, email, password, password_confirmation);
      await login(email, password);
      Swal.fire({
        icon: "success",
        title: t("register.success_title"),
        text: t("register.success_message"),
      });
      navigate("/dashboard", { replace: true });  

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("register.error_title"),
        text: getTranslatedError(t, err),
      });

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout backgroundImage="/home-bg.png">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-4">{t("register.title")}</h1>
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <input
            type="text"
            placeholder={t("profile.name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <input
            type="email"
            placeholder={t("profile.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <input
            type="password"
            placeholder={t("profile.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <input
            type="password"
            placeholder={t("profile.confirm_password_placeholder")}
            value={password_confirmation}
            onChange={(e) => setPassword_confirmation(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-3 rounded font-bold"
          >
            {submitting ? t("register.loading") : t("register.button")}
          </button>
        </form>

        <GoogleLoginButton />
        <p className="text-center text-sm text-gray-600 mt-4">
          {t("register.already_account")}{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            {t("register.login_link")}
          </a>
        </p>
      </div>
    </MainLayout>
  );
};

