import { useState } from "react";
import { saveDive, updateDive } from "../api/dive";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function DiveForm({ editMode, initialData = {}, onClose }) {
  const isEdit = editMode && initialData?.id;
  const { t } = useTranslation();
  const [form, setForm] = useState({
    startTime: initialData.StartTime || "",
    depth: initialData.MaxDepth || "",
    duration: initialData.Duration || "",
    startTemperature: initialData.StartTemperature || "",
    bottomTemperature: initialData.BottomTemperature || "",
    endTemperature: initialData.EndTemperature || "",
    previousMaxDepth: initialData.PreviousMaxDepth || ""
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
        title: t("form.missingFieldTitle"),
        text: t("form.missingFieldText"),
      });
      return;
    }

    try {
      Swal.fire({
        title: t("form.savingTitle"),
        text: t("form.savingText"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

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

      if (isEdit) {
        await updateDive(initialData.id, payload);
      }else {
        await saveDive(payload);
      }

      if (onClose) onClose();

      Swal.fire(t("form.successTitle"), t("form.successText"), "success");

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
      Swal.fire(t("form.errorTitle"), err.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} className="p-3 border rounded" required />
      <input name="depth" type="number" placeholder={`${t("form.maxDepth")}*`} value={form.depth} onChange={handleChange} className="p-3 border rounded" />
      <input name="duration" type="number" placeholder={`${t("form.duration")}*`} value={form.duration} onChange={handleChange} className="p-3 border rounded" />
      <input name="startTemperature" type="number" placeholder={t("form.startTemp")} value={form.startTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="bottomTemperature" type="number" placeholder={t("form.bottomTemp")} value={form.bottomTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="endTemperature" type="number" placeholder={t("form.endTemp")} value={form.endTemperature} onChange={handleChange} className="p-3 border rounded" />
      <input name="previousMaxDepth" type="number" placeholder={t("form.previousMax")} value={form.previousMaxDepth} onChange={handleChange} className="p-3 border rounded" />
      <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-3 px-4 rounded font-bold hover:bg-blue-700 transition">
        {isEdit ? t("form.updateDiveButton") : t("form.addDiveButton")}
      </button>
    </form>
  );
}
