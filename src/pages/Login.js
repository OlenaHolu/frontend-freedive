import { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);

      navigate("/dashboard");
     } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Error al iniciar sesión.");

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.message || "Credenciales incorrectas.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center px-6"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <Navbar />
      <h1 className="text-3xl font-bold text-white mb-6">Login</h1>

      <form 
        onSubmit={handleLogin} 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
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
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-white mt-4">
        Don't have an account? <a href="/register" className="underline">Register here</a>
      </p>

      <GoogleLoginButton />
    </div>
  );
};
