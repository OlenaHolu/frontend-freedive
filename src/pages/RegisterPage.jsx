import React, { use, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from '../components/GoogleLoginButton';
import MainLayout from '../layouts/MainLayout';
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading, setUser, email, setEmail } = useAuth();

  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const userData = await login(email, password);
      setUser(userData);
      Swal.fire({
        icon: "success",
        title: t("register.success_title"),
        text: t("register.success_message"),
      });
    } catch (err) {

      const errorCode = err.response?.data?.errorCode;
      const defaultMessage = t("errors.1001");
      const translated = errorCode ? t(`errors.${errorCode}`) : defaultMessage;

      Swal.fire({
        icon: "error",
        title: t("register.error_title"),
        text: translated,
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
            className={`w-full text-white py-3 rounded font-bold transition ${
              submitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
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

