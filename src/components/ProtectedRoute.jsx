import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">{t("loading")}</p>;

  return user ? children : <Navigate to="/login" />;
}
