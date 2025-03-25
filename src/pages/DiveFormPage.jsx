import { useTranslation } from "react-i18next";
import DiveForm from "../components/DiveForm";

const DiveFormPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">➕ {t("log.title")}</h2>
      <DiveForm />
    </div>
  );
};

export default DiveFormPage;
