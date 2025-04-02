import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 text-base leading-relaxed text-gray-900">
        <h1 className="text-3xl font-bold mb-6">{t("terms.title")}</h1>
        <p className="mb-4 text-sm text-gray-600">
          {t("terms.last_update")} 28/03/2025
        </p>

        <p className="mb-6">{t("terms.intro")}</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.general_title")}</h2>
          <p>{t("terms.general_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.service_title")}</h2>
          <p>{t("terms.service_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.usage_title")}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("terms.usage_age")}</li>
            <li>{t("terms.usage_respect")}</li>
            <li>{t("terms.usage_account")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.ip_title")}</h2>
          <p>{t("terms.ip_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.liability_title")}</h2>
          <p>{t("terms.liability_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.privacy_title")}</h2>
          <p>{t("terms.privacy_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.links_title")}</h2>
          <p>{t("terms.links_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.modifications_title")}</h2>
          <p>{t("terms.modifications_text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("terms.law_title")}</h2>
          <p>{t("terms.law_text", { city: "Madrid" })}</p>
        </section>

        <p className="mt-10">
          {t("terms.contact_text")}{" "}
          <a
            href="mailto:oleholu@gmail.com"
            className="text-blue-600 underline"
          >
            oleholu@gmail.com
          </a>
        </p>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
