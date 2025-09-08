import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900">
        <h1 className="text-2xl font-bold mb-6">{t("privacy.title")}</h1>

        <p className="mb-4">{t("privacy.intro")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("privacy.collect_title")}</h2>
        <p className="mb-4">{t("privacy.collect_desc")}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{t("privacy.collect_email")}</li>
          <li>{t("privacy.collect_data")}</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("privacy.usage_title")}</h2>
        <p className="mb-4">{t("privacy.usage_desc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("privacy.rights_title")}</h2>
        <p className="mb-4">{t("privacy.rights_desc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("privacy.contact_title")}</h2>
        <p>
          {t("privacy.contact_desc")}{" "}
          <a href="mailto:oleholu@egmail.com" className="text-blue-600 underline">
            oleholu@egmail.com
          </a>
        </p>
      </div>
    </MainLayout>
  );
}
