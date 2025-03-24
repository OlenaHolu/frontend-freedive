import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-gray-300">
    <Navbar />

    <div className="flex flex-col items-center md:items-start justify-center h-full px-6 md:px-12 text-white text-center md:text-left">
     
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, <strong>{user?.name}</strong></p>
      {user?.photo && (
        <img
          src={user.photo}
          alt="Profile"
          className="w-20 h-20 rounded-full my-4"
        />
      )}
    </div>
  </div>
  );
}
