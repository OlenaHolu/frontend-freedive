import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DiveForm from "../components/DiveForm";
import DiveList from "../components/DiveList";
import { useEffect, useState } from "react";
import { getDives } from "../api/dive";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [dives, setDives] = useState([]);

  useEffect(() => {
    const fetchDives = async () => {
      try{
        const res = await getDives();
        setDives(res.dives);
      } catch (err) {
        console.error("Error fetching dives:", err);
      }
    };
    if (user) fetchDives();
  }, [user]);

  if (loading || !user) return <p className="text-center text-white">Loading...</p>;

  const handleAddDive = (updetedList) => {
    setDives(updetedList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-500 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || "Diver"} 👋</h1>

        {user.photo && (
          <img 
            src={user.photo} 
            alt="Profile" 
            className="w-20 h-20 rounded-full my-4 border-4 border-white" 
            referrerPolicy="no-referrer"
          />
        )}

        <div className="mt-6 bg-white text-black p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Log a New Dive</h2>
          <DiveForm onAddDive={handleAddDive} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Dives</h2>
          <DiveList dives={dives} />
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold mb-2">📈 Coming soon: Dive Stats & Graphs</h3>
          <div className="w-full h-40 bg-white bg-opacity-20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
            <p className="italic text-lg">📊 Chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
