import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { updateUserPhoto } from "../api/auth";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const [preview, setPreview] = useState(user?.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p className="text-white text-center mt-8">{t("loading")}</p>;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      resizeImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resizeImage = (base64) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 300;
      const scale = Math.min(size / img.width, size / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);
      setPreview(resizedBase64);
      setSelectedFile(resizedBase64); // store for upload
    };
    img.src = base64;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
  
    try {
      Swal.fire({
        title: t("profile.uploading"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      const updatedUser = await updateUserPhoto(selectedFile);
      setUser(updatedUser);
      setSelectedFile(null);
  
      Swal.fire({
        icon: "success",
        title: t("profile.updated"),
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      Swal.fire({
        icon: "error",
        title: t("profile.error"),
        text: t("profile.upload_error"),
      });
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg text-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("profile.title")}</h1>

      {/* Avatar + Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <img
          src={preview || "/default-user.png"}
          alt={t("profile.avatar")}
          className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md object-cover transition"
          referrerPolicy="no-referrer"
        />

        <div className="flex flex-col gap-3 text-sm w-full sm:w-auto">
          <label htmlFor="avatarUpload" className="font-medium">
            {t("profile.change_photo")}
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm bg-white border border-gray-300 rounded-md px-3 py-1 shadow-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className={`bg-blue-600 text-white rounded-md py-1.5 px-4 shadow-md hover:bg-blue-700 transition ${
              (loading || !selectedFile) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? t("profile.uploading") : t("profile.update_button")}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-base space-y-2 mb-8">
        <p>
          <strong>{t("profile.name")}:</strong> {user.name}
        </p>
        <p>
          <strong>{t("profile.email")}:</strong> {user.email}
        </p>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-2">{t("profile.settings")}</h2>
        <p className="text-sm text-gray-500">{t("profile.comingSoon")} ⚙️</p>
      </div>
    </div>
  );
}
