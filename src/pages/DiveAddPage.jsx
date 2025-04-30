import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";
import Swal from "sweetalert2";
import DiveImportButton from "../components/DiveImportButton";
import { parseDiveXml, parseSmlDive } from "../utils/diveParsers";
import { saveMultipleDives } from "../api/dive";
import { useNavigate } from "react-router-dom";

const DiveAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  

  const handleImportedFiles = async (files) => {
    const totalFiles = files.length;
/*
    // ❗ Límite de archivos
    if (totalFiles > 100) {
      return Swal.fire({
        icon: "warning",
        title: t("dive.import.tooManyFiles"),
        text: t("dive.import.maxFilesMessage"),
      });
    }
*/
    let totalDives = [];

    const simulateProgressUntilDone = async (start, end, duration, isDone) => {
      const steps = end - start;
      const delay = duration / steps;

      for (let i = 1; i <= steps; i++) {
        if (isDone()) break;

        await new Promise((res) => setTimeout(res, delay));
        const percent = start + i;
        const bar = document.getElementById("swal-progress-bar");
        const textEl = document.getElementById("swal-progress-text");
        if (bar && textEl) {
          bar.style.width = `${percent}%`;
          textEl.textContent = `${percent}%`;
        }
      }
    };

    Swal.fire({
      title: t("dive.import.loading"),
      html: `
        <div style="margin-top: 10px;">
          <div style="width: 100%; background-color: #eee; border-radius: 8px; overflow: hidden; height: 20px;">
            <div id="swal-progress-bar" style="width: 0%; height: 100%; background-color: #10b981; transition: width 0.2s;"></div>
          </div>
          <div id="swal-progress-text" style="margin-top: 8px; font-size: 14px; font-weight: 500; text-align: center;">0%</div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    // Fase 1: parseo real (0-1%)
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const text = await file.text();
      const parsed = file.name.endsWith(".sml")
        ? parseSmlDive(text)
        : parseDiveXml(text);
      totalDives = [...totalDives, ...parsed];

      const percent = Math.round(((i + 1) / totalFiles) * 1);
      const bar = document.getElementById("swal-progress-bar");
      const textEl = document.getElementById("swal-progress-text");
      if (bar && textEl) {
        bar.style.width = `${percent}%`;
        textEl.textContent = `${percent}%`;
      }
    }

    if (totalDives.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: t("dive.import.noValidData"),
        text: t("dive.import.noItemsFound"),
      });
    }

    try {
      // Fase 3: simulación + guardado
      let savingDone = false;
      let saveError = null;

      const savePromise = saveMultipleDives(totalDives)
        .then(() => {
          savingDone = true;
        })
        .catch((err) => {
          saveError = err;       
          savingDone = true;
        });


      await simulateProgressUntilDone(1, 98, 100000, () => savingDone);
      await savePromise;

      if (saveError) {
        console.error("Import error:", saveError);
        return Swal.fire({
          icon: "error",
          title: "❌ " + t("error"),
          text: t("dive.import.error"),
        });
      }

      // Asegurarse que se muestre 100%
      const bar = document.getElementById("swal-progress-bar");
      const textEl = document.getElementById("swal-progress-text");
      if (bar && textEl) {
        bar.style.width = `100%`;
        textEl.textContent = `100%`;
      }
      await new Promise((res) => setTimeout(res, 1500));

      await Swal.fire({
        icon: "success",
        title: t("dive.import.success"),
        text: `${totalDives.length} ${t("dive.import.divesImported")}`,
        confirmButtonColor: "#10b981",
      });
      navigate("/dashboard/list");
    } catch (err) {
      console.error("Import error:", err);
      Swal.fire({
        icon: "error",
        title: "❌" + t("error"),
        text: t("dive.import.error"),
      });
    }
  };

  const ImportDescription = () => {
    const { t } = useTranslation();

    return (
      <div className="text-sm text-gray-700 space-y-2">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          ➕ {t("dive.import.description.title")}
        </h3>
        <p>{t("dive.import.description.text")}</p>
        <p>✔️ <strong>{t("dive.import.description.formats")}</strong></p>
        
        { /* <p>📁 <strong>{t("dive.import.description.limit")}</strong></p> */}
      </div>
    );
  };


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Import Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <ImportDescription />
        <DiveImportButton onFilesSelected={handleImportedFiles} />
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          ➕ {t("log.title")}
        </h3>
        <DiveForm />
      </div>
    </div>
  );
};

export default DiveAddPage;
