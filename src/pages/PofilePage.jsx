import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation();

    if (!user) return <p className="text-white text-center mt-8">{t("loading")}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

            {/* Avatar */}
            {user.photo && (
                <img
                    src={user.photo}
                    alt={t("profile.avatar")}
                    className="w-24 h-24 rounded-full mb-4 border-4 border-white"
                    referrerPolicy="no-referrer"
                />
            )}

            {/* Info */}
            <div className="text-lg space-y-2">
                <p><strong>{t("profile.name")}:</strong> {user.name}</p>
                <p><strong>{t("profile.email")}:</strong> {user.email}</p>
            </div>

            {/* Future Settings Section */}
            <div className="mt-8 border-t border-white pt-6">
                <h2 className="text-xl font-semibold mb-4">{t("profile.settings")}</h2>

                <p className="text-sm text-gray-500">
                    {t("profile.comingSoon")} ⚙️
                </p>
            </div>
        </div>
    );
}
