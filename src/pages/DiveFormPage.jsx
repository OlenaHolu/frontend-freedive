import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";
import ImportDiveButton from "../components/ImportDiveButton";

const DiveFormPage = () => {
  const { t } = useTranslation();

  const handleImportedFile = (file) => {
    console.log("Imported file:", file);
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
