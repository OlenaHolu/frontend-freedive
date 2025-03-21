import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  // Prevent redirect loop during registration
  const isAuthPage = location.pathname === "/register" || location.pathname === "/login";

  if (!user && !isAuthPage) return <Navigate to="/login" />;

  return children;
}
