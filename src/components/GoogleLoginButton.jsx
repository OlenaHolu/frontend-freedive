import Swal from "sweetalert2";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function GoogleLoginButton() {
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/google`;
    } catch (error) {
      console.error("Google login error:", error);
      await Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("google_login_error"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={submitting}
      className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? (
        <svg
          className="w-5 h-5 animate-spin text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>{t("login.login_with_google")}</span>
        </>
      )}
    </button>
  );
}
