import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { loginWithGoogle } from "../api/auth";
import { useTranslation } from "react-i18next";

export default function GoogleCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        Swal.fire(t("error"), t("login.google_login_error"), "error");
        return navigate("/login");
      }

      try {
        const user = await loginWithGoogle(code);
        if (user) {
          setUser(user);
          navigate("/dashboard");
        } else {
          Swal.fire(t("error"), t("login.google_login_error"), "error");
          navigate("/login");
        }
      } catch (err) {
        console.error("Google login failed:", err);
        Swal.fire(t("error"), t("login.google_login_error"), "error");
        navigate("/login");
      }
    };

    fetchGoogleUser();
  }, [navigate, setUser, t]);

  return <p className="text-center mt-8 text-white">{t("loading")}</p>;
}
