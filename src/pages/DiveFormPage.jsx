import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";
import ImportDiveButton from "../components/ImportDiveButton";
import { parseDiveXml, parseSmlDive } from "../utils/diveParsers";
import { saveMultipleDives } from "../api/dive";

const DiveFormPage = () => {
  const { t } = useTranslation();

  const handleImportedFile = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const xmlText = event.target.result;
    
      const parsedDives = file.name.endsWith(".sml")
      ? parseSmlDive(xmlText)
      : parseDiveXml(xmlText);
    
      console.log("Dives extraidos:", parsedDives);

      await saveMultipleDives(parsedDives);
      alert(`Importacion exitosa: ${parsedDives.length} inmersiones importadas`);
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Import Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {t("dive.importTitle")}
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
