import React from "react";
import EditProfileForm from "./EditProfileForm";

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
    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar + Upload */}
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
                <div>
                    <strong>{user.postCount}</strong> {t("posts")}
                </div>
                <div><strong>0</strong> {t("followers")}</div>
                <div><strong>0</strong> {t("following")}</div>
            </div>

            {/* Settings */}
            <div className="pt-6 border-t border-gray-200">
                <button
                    onClick={() => setShowSettings((prev) => !prev)}
                    className="flex items-center gap-2 text-sm text-left text-gray-500 hover:text-black transition font-medium"
                >
                    <span>⚙️</span>
                    <span>{t("settings")}</span>
                </button>

                {showSettings && (
                    <EditProfileForm
                        onClose={() => setShowSettings(false)}
                        handleDeleteProfile={handleDeleteProfile}
                    />
                )}
            </div>
        </div>
    );
}
