import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { updateUserPhoto, deleteProfile } from "../api/auth";
import { auth } from "../lib/firebaseClient";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(user?.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p className="text-white text-center mt-8">{t("loading")}</p>;
  }

  const resizeImage = (base64) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 300;
        const scale = Math.min(size / img.width, size / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = base64;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result);
      setPreview(resized);
      setSelectedFile(resized);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      Swal.fire({
        title: t("profile.uploading"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = await Swal.fire({
      title: t("profile.confirm_delete_title"),
      text: t("profile.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("profile.confirm_delete_button"),
      cancelButtonText: t("cancel"),
      confirmButtonColor: "#e3342f"
    });

    if (!confirmed.isConfirmed) return;

    try {
      Swal.fire({
        title: t("profile.deleting"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteProfile();
      setUser(null);

      const result = await Swal.fire({
        icon: "success",
        title: t("profile.deleted"),
        text: t("profile.deleted_message"),
        showConfirmButton: true,
        confirmButtonText: t("ok"),
      });

      await signOut(auth);

      if (result.isConfirmed) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      Swal.fire({
        icon: "error",
        title: t("profile.error"),
        text: t("profile.delete_error"),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-xl text-gray-900">
      <h1 className="text-4xl font-extrabold text-center mb-10">{t("profile.title")}</h1>
  
      {/* Avatar + Upload */}
<div className="flex flex-col items-center justify-center gap-4 mb-10">
  <div className="relative group cursor-pointer">
    <img
      src={preview || "/default-avatar.png"}
      alt={t("profile.avatar")}
      className="w-32 h-32 rounded-full border-4 border-blue-500 shadow object-cover transition duration-300 group-hover:brightness-75"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
      <span className="bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
        {t("profile.change_photo")}
      </span>
    </div>
    {/* Hidden input */}
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      aria-label={t("profile.change_photo")}
      className="absolute inset-0 opacity-0 cursor-pointer"
    />
  </div>

  {selectedFile && (
    <button
      onClick={handleUpload}
      disabled={loading}
      className="bg-blue-600 text-white py-2 px-5 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? t("profile.uploading") : t("profile.update_button")}
    </button>
  )}
</div>

  
      {/* Info */}
      <div className="mb-10 space-y-2 text-base text-gray-800">
        <p><strong>{t("profile.name")}:</strong> {user.name}</p>
        <p><strong>{t("profile.email")}:</strong> {user.email}</p>
      </div>
  
      {/* Ajustes y eliminación */}
      <div className="pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-2">{t("profile.settings")}</h2>
        <p className="text-sm text-gray-500 mb-6">{t("profile.comingSoon")} ⚙️</p>
  
        <div className="flex justify-end">
          <button
            onClick={handleDeleteProfile}
            className="bg-red-600 text-white py-2 px-5 rounded-md shadow hover:bg-red-700 transition"
          >
            {t("profile.delete_button")}
          </button>
        </div>
      </div>
    </div>
  );
}  