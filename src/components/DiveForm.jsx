import { useState } from "react";
import { saveDive, updateDive } from "../api/dive";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { formatDuration, mmssToSeconds } from "../utils/time";

export default function DiveForm({ editMode, initialData = {}, onClose }) {
  const isEdit = editMode && initialData?.id;
  const { t } = useTranslation();

  const [form, setForm] = useState({
    startTime: initialData.StartTime || "",
    depth: initialData.MaxDepth || "",
    duration: initialData.Duration || "",
    durationFormatted: initialData.Duration
      ? formatDuration(initialData.Duration)
      : "",
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
        title: t("dive.missingFieldTitle"),
        text: t("dive.missingFieldText"),
      });
      return;
    }

    try {
      Swal.fire({
        title: t("dive.savingTitle"),
        text: t("dive.savingText"),
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

      Swal.fire(t("dive.successTitle"), t("dive.successText"), "success");

      setForm({
        startTime: "",
        depth: "",
        duration: "",
        durationFormatted: "",
        startTemperature: "",
        bottomTemperature: "",
        endTemperature: "",
        previousMaxDepth: ""
      });
    } catch (err) {
      console.error(err);
      Swal.fire(t("dive.errorTitle"), err.message, "error");
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("dive.startTime")}*</label>
        <input
          type="datetime-local"
          name="startTime"
          step="1"
          value={form.startTime}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white text-black"
          required
        />
      </div>


      <div>
        <label className={labelClass}>{t("dive.maxDepth")} *</label>
        <input name="depth" type="number" placeholder="e.g. 25" value={form.depth} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t("dive.duration")} *</label>
        <input
          name="durationFormatted"
          type="text"
          placeholder="mm:ss"
          value={form.durationFormatted}
          onChange={(e) => {
            const value = e.target.value;
            setForm({
              ...form,
              durationFormatted: value,
              duration: mmssToSeconds(value),
            });
          }}
          className={inputClass}
          required
        />
      </div>

      {/* Start Temperature */}
      <div>
        <label className={labelClass}>{t("dive.startTemp")}</label>
        <div className="flex items-center border rounded px-3 py-2 bg-white text-black">
          <input
            name="startTemperature"
            type="number"
            value={form.startTemperature}
            onChange={handleChange}
            className="flex-1 outline-none bg-transparent"
            placeholder="e.g. 22"
          />
        </div>
      </div>

      {/* Bottom Temperature */}
      <div>
        <label className={labelClass}>{t("dive.bottomTemp")}</label>
        <div className="flex items-center border rounded px-3 py-2 bg-white text-black">
          <input
            name="bottomTemperature"
            type="number"
            value={form.bottomTemperature}
            onChange={handleChange}
            className="flex-1 outline-none bg-transparent"
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {/* End Temperature */}
      <div>
        <label className={labelClass}>{t("dive.endTemp")}</label>
        <div className="flex items-center border rounded px-3 py-2 bg-white text-black">
          <input
            name="endTemperature"
            type="number"
            value={form.endTemperature}
            onChange={handleChange}
            className="flex-1 outline-none bg-transparent"
            placeholder="e.g. 24"
          />
        </div>
      </div>


      <div>
        <label className={labelClass}>{t("dive.previousMax")}</label>
        <input name="previousMaxDepth" type="number" value={form.previousMaxDepth} onChange={handleChange} className={inputClass} />
      </div>

      <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition w-full sm:w-auto"
        >
          {isEdit ? t("dive.updateDiveButton") : t("dive.addDiveButton")}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition w-full sm:w-auto"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
