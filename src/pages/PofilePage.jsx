import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { updateUserPhoto, deleteProfile } from "../api/auth";
import { auth } from "../lib/firebaseClient";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const tabs = [
  { key: "posts", label: "Posts" },
  { key: "tagged", label: "Tagged" }
];

const fakePosts = new Array(9).fill(null).map((_, i) => ({
  id: i,
  image: `https://source.unsplash.com/300x300/?freedive,sea,${i}`
}));

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(user?.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

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
    <div className="max-w-3xl mx-auto px-4 py-10 text-black">
      {/* Header */}
      {/* Avatar + Upload */}
      <div className="flex flex-col items-center gap-4">
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


        <h1 className="text-xl font-semibold">{user.name}</h1>

        <div className="flex gap-6 text-sm text-gray-600">
          <div><strong>0</strong> {t("posts")}</div>
          <div><strong>0</strong> {t("followers")}</div>
          <div><strong>0</strong> {t("following")}</div>
        </div>

        <div className="flex gap-2 mt-2">
          <button 
            className="bg-gray-200 text-sm px-4 py-1 rounded-md font-medium">
            {t("profile.edit")}
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-10 flex justify-center gap-4">
        <div className="flex flex-col items-center text-sm">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-white shadow-inner text-3xl text-gray-400">
            +
          </div>
          <span className="mt-1">New</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-t border-gray-300">
        <div className="flex justify-around text-sm font-medium text-gray-500">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 w-full ${
                activeTab === tab.key
                  ? "border-t-2 border-black text-black"
                  : "hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1">
            {fakePosts.map((post) => (
              <div key={post.id} className="aspect-square bg-gray-200">
                <img
                  src={post.image}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "tagged" && (
          <div className="text-center text-sm text-gray-500 py-10 italic">
            {t("profile.no_tagged")}
          </div>
        )}
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