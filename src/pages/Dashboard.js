import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.name}</p>
      {user?.photo && <img src={user.photo} alt="Profile" style={{ width: "100px", borderRadius: "50%" }} />}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
