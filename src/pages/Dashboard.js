import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // 🔹 Llamar a logout()
    navigate("/login"); // 🔹 Redirigir al login después de cerrar sesión
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.name}</p>
      <img src={user?.photo} alt="userPhoto" />
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
