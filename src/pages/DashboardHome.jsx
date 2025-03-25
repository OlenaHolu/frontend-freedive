import { useTranslation } from "react-i18next";

const DashboardHome = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t("dashboard.welcome")} 👋</h1>
      <p>{t("dashboard.description")}</p>
    </div>
  );
};

export default DashboardHome;
