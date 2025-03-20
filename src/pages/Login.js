import { useState, useEffect } from "react";
import { login, loginWithGoogle } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);

      // 🔹 Store token in local storage
      localStorage.setItem("firebaseToken", userData.token);

      // 🔹 Update user state
      setUser(userData.user);

      // 🔹 Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials or user not registered.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await loginWithGoogle();

      // 🔹 Store token in local storage
      localStorage.setItem("firebaseToken", userData.token);

      // 🔹 Update user state
      setUser(userData.user);

      // 🔹 Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Error logging in with Google.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center px-6"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      <h1 className="text-3xl font-bold text-white mb-6">Login</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
          className="w-full bg-blue-500 text-white py-3 rounded font-bold"
        >
          Login
        </button>
      </form>

      <p className="text-white mt-4">
        Don't have an account? <a href="/register" className="underline">Register here</a>
      </p>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 bg-red-500 text-white px-6 py-3 rounded font-bold"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
