import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";
import Swal from "sweetalert2";
import ImportDiveButton from "../components/ImportDiveButton";
import { parseDiveXml, parseSmlDive } from "../utils/diveParsers";
import { saveMultipleDives } from "../api/dive";

const DiveFormPage = () => {
  const { t } = useTranslation();

  const handleImportedFile = async (file) => {
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      try {
        Swal.fire({
          title: t("dive.import.loading"),
          text: t("dive.import.processingFile"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        const xmlText = event.target.result;
  
        const parsedDives = file.name.endsWith(".sml")
          ? parseSmlDive(xmlText)
          : parseDiveXml(xmlText);
  
        console.log("Dives extraídos:", parsedDives);
  
        await saveMultipleDives(parsedDives);
  
        Swal.fire({
          icon: "success",
          title: t("dive.import.success"),
          text: `${parsedDives.length} ${t("dive.import.divesImported")}`,
          confirmButtonColor: "#10b981", // verde
        });
      } catch (err) {
        console.error("Error al importar el archivo", err);
        Swal.fire({
          icon: "error",
          title: "❌ Error",
          text: t("dive.import.error"),
        });
      }
    };
  
    reader.readAsText(file);
  };
  

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Import Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {t("dive.import.title")}
        </h3>
        <ImportDiveButton onFileSelected={handleImportedFile} />
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
