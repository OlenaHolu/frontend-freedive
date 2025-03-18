import { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      console.log("Usuario autenticado, redirigiendo a /dashboard");
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      console.log("Login exitoso, guardando usuario:", userData.user);

      setUser(userData.user); // 🔹 Se guarda el usuario en el contexto global
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas o usuario no registrado.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
}
