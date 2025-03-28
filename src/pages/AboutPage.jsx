import MainLayout from "../layouts/MainLayout";
import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-900">
                <h1 className="text-3xl font-bold mb-6">{t("about.title")}</h1>

                <p className="mb-6 text-gray-700">
                    {t("about.intro")}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{t("about.who_title")}</h2>
                    <p className="text-gray-700">
                        {t("about.who_text")}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{t("about.mission_title")}</h2>
                    <p className="text-gray-700">
                        {t("about.mission_text")}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{t("about.offer_title")}</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>{t("about.offer_1")}</li>
                        <li>{t("about.offer_2")}</li>
                        <li>{t("about.offer_3")}</li>
                        <li>{t("about.offer_4")}</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{t("about.why_title")}</h2>
                    <p className="text-gray-700">
                        {t("about.why_text")}
                    </p>
                </section>

                <p className="mt-10 text-gray-700">
                    {t("about.closing")}
                </p>
            </div>
        </MainLayout>
    );
};

export default AboutPage;
