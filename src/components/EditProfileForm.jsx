import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { updateProfileInfo } from "../api/auth"; // 🔧 Este endpoint debería existir

export default function EditProfileForm() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    email: user?.email || ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.username) {
      Swal.fire({
        icon: "warning",
        title: t("profile.form.incomplete"),
        text: t("profile.form.required_fields"),
      });
      return;
    }

    try {
      setLoading(true);
      Swal.fire({
        title: t("profile.saving"),
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      const updatedUser = await updateProfileInfo(formData);
      setUser(updatedUser);

      Swal.fire({
        icon: "success",
        title: t("profile.saved"),
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t("profile.error"),
        text: t("profile.save_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6 text-gray-800"
    >
      <h2 className="text-2xl font-bold text-center">{t("profile.edit_profile")}</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t("profile.name")}</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t("profile.username")}</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t("profile.bio")}</label>
        <textarea
          name="bio"
          rows="3"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t("profile.email")}</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full bg-gray-100 border rounded px-3 py-2"
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {t("profile.save_button")}
        </button>
      </div>
    </form>
  );
}
