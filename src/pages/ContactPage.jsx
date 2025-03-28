import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">{t("contact.title")}</h1>
        <p className="mb-6 text-gray-700">{t("contact.description")}</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {t("contact.form.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t("contact.form.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              {t("contact.form.message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("contact.form.submit")}
          </button>
        </form>

        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">{t("contact.also_contact")}</h2>
          <p className="text-gray-700">
            📧{" "}
            <a href="mailto:oleholu@gmail.com" className="underline text-blue-600">
              oleholu@gmail.com
            </a>
          </p>
          <p className="text-gray-700 mt-2">📍 {t("contact.location")}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
