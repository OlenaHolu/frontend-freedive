import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveDive, getDives } from "../api/dive";
import Swal from "sweetalert2";

export default function DiveForm({ onAddDive }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    startTime: "",
    depth: "",
    duration: "",
    startTemperature: "",
    bottomTemperature: "",
    endTemperature: "",
    previousMaxDepth: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["startTime", "depth", "duration"];
    const missing = required.find((key) => !form[key]);
    if (missing) {
      Swal.fire({
        icon: "error",
        title: "Missing field",
        text: "Please fill all required fields.",
      });
      return;
    }

    try {
      const payload = {
        StartTime: form.startTime,
        MaxDepth: form.depth,
        Duration: form.duration,
        StartTemperature: form.startTemperature,
        BottomTemperature: form.bottomTemperature,
        EndTemperature: form.endTemperature,
        PreviousMaxDepth: form.previousMaxDepth,
        Mode: 3 // por defecto FreeDive
      };

      await saveDive(payload);
      
      const updetedDives = await getDives();
      onAddDive(updetedDives.dives); 

      Swal.fire("✅ Dive Saved!", "", "success");

      // Reset
      setForm({
        startTime: "",
        depth: "",
        duration: "",
        startTemperature: "",
        bottomTemperature: "",
        endTemperature: "",
        previousMaxDepth: ""
      });
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error saving dive", err.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} className="p-3 border rounded" required />
      <input name="depth" type="number" placeholder="MaxDepth (m)*" value={form.depth} onChange={handleChange} className="p-3 border rounded" />
      <input name="duration" type="number" placeholder="Duration (min)*" value={form.duration} onChange={handleChange} className="p-3 border rounded" />
      <input name="startTemperature" type="number" placeholder="Start Temp (°C)" value={form.startTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="bottomTemperature" type="number" placeholder="Bottom Temp (°C)" value={form.bottomTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="endTemperature" type="number" placeholder="End Temp (°C)" value={form.endTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="previousMaxDepth" type="number" placeholder="Previous Max Depth (m)" value={form.previousMaxDepth} onChange={handleChange} className="p-3 border rounded" />
      <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-3 px-4 rounded font-bold hover:bg-blue-700 transition">
        Add Dive
      </button>
    </form>
  );
}
