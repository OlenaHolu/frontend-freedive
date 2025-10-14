const ContactForm = ({ t, loading, handleSubmit }) => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name */}
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
  
      {/* Email */}
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
  
      {/* Message */}
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
  );
export default ContactForm;  