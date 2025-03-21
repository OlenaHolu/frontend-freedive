import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../api/auth";

export default function GoogleLoginButton() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();

      navigate("/dashboard"); // 🔹 Redirigir después de la alerta
    } catch (error) {
      console.error("Google login error:", error);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong during Google login",
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
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
}
