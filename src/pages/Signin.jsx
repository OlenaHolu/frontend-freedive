import React, { use, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from '../components/GoogleLoginButton';
import MainLayout from '../layouts/MainLayout';
import { t } from 'i18next';

export default function Signin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { email, setEmail } = useAuth();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Redirección automática si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(email, password, name);

    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message || t('signIn.error_generic'));

      Swal.fire({
        icon: "error",
        title: t("register.error"),
        text: err.message || t("signIn.error_generic"),
      });

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout backgroundImage="/home-bg.png">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-4">{t("signIn.title")}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <input
            type="text"
            placeholder={t("signIn.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <input
            type="email"
            placeholder={t("signIn.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <input
            type="password"
            placeholder={t("signIn.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded mb-3"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-3 rounded font-bold"
          >
            {submitting ? t("signIn.loading") : t("signIn.button")}
          </button>
        </form>

        <GoogleLoginButton />
        <p className="text-center text-sm text-gray-600 mt-4">
          {t("signIn.already_account")}{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            {t("signIn.login_link")}
          </a>
        </p>
      </div>
    </MainLayout>
  );
};

