import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Freedive Analyzer</h1>
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/register">Registrarse</Link>
    </div>
  );
}
