import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { updateProfile as updateUserProfile } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function EditProfileForm({ onClose, handleDeleteProfile }) {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError(t("profile.passwords_mismatch"));
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword, t]);

  const handleSaveProfile = async () => {
    try {
      if (passwordError) return;

      setLoading(true);
      Swal.fire({
        title: t("saving"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        name: newName,
        email: newEmail,
      };

      // Solo agregar contraseña si se están editando
      if (newPassword && confirmPassword) {
        payload.password = newPassword;
        payload.password_confirmation = confirmPassword;
      }

      const updatedUser = await updateUserProfile(payload);

      setUser(updatedUser);

      Swal.fire({
        icon: "success",
        title: t("profile.updated_message"),
        timer: 1500,
        showConfirmButton: false,
      });

      onClose?.();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("profile.update_error"),
        confirmButtonText: t("close"),
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-sm space-y-4 mt-4">
      {/* Name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
          {t("profile.name")}
        </label>
        <input
          id="name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t("profile.name_placeholder")}
          className="border p-2 rounded"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
          {t("profile.email")}
        </label>
        <input
          id="email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder={t("profile.email_placeholder")}
          className="border p-2 rounded"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
          {t("profile.new_password")}
        </label>
        <input
          id="password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t("profile.password_placeholder")}
          className="border p-2 rounded"
        />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1">
          {t("profile.confirm_password")}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("profile.confirm_password_placeholder")}
          className="border p-2 rounded"
        />
        {passwordError && (
          <p className="text-sm text-red-600 mt-1">{passwordError}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSaveProfile}
          disabled={loading || !!passwordError}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t("profile.saving") : t("save")}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
        >
          {t("cancel")}
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-4">
        <button
          onClick={handleDeleteProfile}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          🗑️ {t("profile.delete_button")}
        </button>
      </div>
    </div>
  );
}
