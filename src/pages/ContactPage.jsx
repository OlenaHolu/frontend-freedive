import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout";
import { sendContactMessage } from "../api/contact";

const ContactPage = () => {
  const { t, ready } = useTranslation(undefined, { useSuspense: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await sendContactMessage(data);

      Swal.fire({
        icon: "success",
        title: t("contact.success_title") || "Message sent ✅",
        text: t("contact.success_message") || "Thanks for getting in touch!",
      });

      e.target.reset();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: t("contact.error_title") || "Oops! ❌",
        text: t("contact.error_message") || "Failed to send message. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-gray-600 text-lg font-medium">
          {t("loading")}
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">{t("contact.title")}</h1>
        <p className="mb-6 text-gray-700">{t("contact.description")}</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {t("profile.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t("profile.name_placeholder")}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t("profile.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("profile.email_placeholder")}
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
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : t("contact.form.submit")}
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
