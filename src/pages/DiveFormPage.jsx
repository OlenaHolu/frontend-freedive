import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";
import Swal from "sweetalert2";
import ImportDiveButton from "../components/ImportDiveButton";
import { parseDiveXml, parseSmlDive } from "../utils/diveParsers";
import { saveMultipleDives } from "../api/dive";

const DiveFormPage = () => {
  const { t } = useTranslation();

  const handleImportedFiles = async (files) => {
    let totalDives = [];
  
    for (const file of files) {
      const text = await file.text();
      const parsed = file.name.endsWith(".sml")
        ? parseSmlDive(text)
        : parseDiveXml(text);
  
      if (Array.isArray(parsed)) {
        totalDives = [...totalDives, ...parsed];
      }
    }
  
    if (totalDives.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: t("dive.import.noValidData"),
        text: t("dive.import.noDivesFound"),
      });
    }
  
    try {
      Swal.fire({
        title: t("dive.import.loading"),
        text: t("dive.import.processingFile"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
  
      await saveMultipleDives(totalDives);
  
      Swal.fire({
        icon: "success",
        title: t("dive.import.success"),
        text: `${totalDives.length} ${t("dive.import.divesImported")}`,
        confirmButtonColor: "#10b981",
      });
    } catch (err) {
      console.error("Import error:", err);
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: t("dive.import.error"),
      });
    }
  };  

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Import Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {t("dive.import.title")}
        </h3>
        <ImportDiveButton onFilesSelected={handleImportedFiles} />

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

export default DiveFormPage;
