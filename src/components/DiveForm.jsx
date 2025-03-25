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
        Mode: 3
      };

      isEdit ? await updateDive(initialData.id, payload) : await saveDive(payload);

      if (onClose) onClose();

      Swal.fire(t("form.successTitle"), t("form.successText"), "success");

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

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
    >
      <div>
        <label className={labelClass}>{t("form.startTime")}</label>
        <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>{t("form.maxDepth")} *</label>
        <input name="depth" type="number" placeholder="e.g. 25" value={form.depth} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t("form.duration")} *</label>
        <input name="duration" type="number" placeholder="e.g. 60" value={form.duration} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t("form.startTemp")}</label>
        <input name="startTemperature" type="number" value={form.startTemperature} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t("form.bottomTemp")}</label>
        <input name="bottomTemperature" type="number" value={form.bottomTemperature} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t("form.endTemp")}</label>
        <input name="endTemperature" type="number" value={form.endTemperature} onChange={handleChange} className={inputClass} />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <label className={labelClass}>{t("form.previousMax")}</label>
        <input name="previousMaxDepth" type="number" value={form.previousMaxDepth} onChange={handleChange} className={inputClass} />
      </div>

      <div className="md:col-span-2 lg:col-span-3 text-center mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition"
        >
          {isEdit ? t("form.updateDiveButton") : t("form.addDiveButton")}
        </button>
      </div>
    </form>
  );
}
