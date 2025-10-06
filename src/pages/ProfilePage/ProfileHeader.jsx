import React from "react";
import EditProfileForm from "./EditProfileForm";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Settings } from "lucide-react"; // iconos modernos, si tienes Lucide

export default function ProfileHeader({
    user,
    t,
    preview,
    selectedFile,
    loading,
    showSettings,
    setShowSettings,
    handleFileChange,
    handleUpload,
    handleDeleteProfile
}) {
    const { logout } = useAuth();

    return (
        <div className="w-full max-w-xl mx-auto bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
                <img
                    src={preview || "/default-avatar.png"}
                    alt={t("profile.avatar")}
                    className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg object-cover transition group-hover:brightness-90"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                        {t("profile.change_photo")}
                    </span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    aria-label={t("profile.change_photo")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>

            {/* Upload button */}
            {selectedFile && (
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? t("profile.uploading") : t("profile.update_button")}
                </button>
            )}

            {/* Username */}
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

            {/* Settings + Logout */}
            <div className="w-full flex flex-col items-center gap-3 pt-6 border-t border-gray-200">
                <button
                    onClick={() => setShowSettings((prev) => !prev)}
                    className="flex items-center gap-2 text-base text-gray-600 hover:text-blue-700 font-medium transition"
                >
                    <Settings size={18} />
                    <span>{t("settings")}</span>
                </button>
                {showSettings && (
                    <EditProfileForm
                        onClose={() => setShowSettings(false)}
                        handleDeleteProfile={handleDeleteProfile}
                    />
                )}

                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2 rounded-full font-medium shadow transition mt-2"
                >
                    <LogOut size={18} />
                    {t("logout")}
                </button>
            </div>
        </div>
    );
}
