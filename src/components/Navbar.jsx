import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <nav className="w-full bg-black bg-opacity-80 text-white py-4 px-6 flex justify-between items-center z-50">
            {/* Logo */}
            <div className="text-lg font-bold">Freedive Analyzer</div>

            {/* Menu desktop */}
            <div className="hidden md:flex space-x-6">
                <a href="/" className="hover:underline">{t("home")}</a>
                <a href="/dashboard" className="hover:underline">{t("dashboard.name")}</a>
                <a href="/about" className="hover:underline">{t("about.title")}</a>
            </div>

            {/* Login / Logout */}
            <div className="hidden md:flex items-center space-x-4">
                <LanguageSwitcher />
                {user ? (
                    <button onClick={logout} className="bg-gray-900 px-4 py-2 rounded-lg border border-white">
                        {t("logout")}
                    </button>
                ) : (
                    <button onClick={() => navigate("/login")} className="bg-gray-900 px-4 py-2 rounded-lg border border-white">
                        {t("login.title")}
                    </button>
                )}
            </div>

            {/* Hamburger menu for mobile */}
            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="absolute top-14 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center py-4 space-y-4">
                    <a href="/">{t("home")}</a>
                    <a href="/dashboard">{t("dashboard")}</a>
                    <a href="/leaderboard">{t("leaderboard")}</a>
                    <a href="/community">{t("community")}</a>
                    <a href="/about">{t("about")}</a>
                    <LanguageSwitcher />
                    {user ? (
                        <button onClick={logout} className="bg-gray-900 px-4 py-2 rounded-lg border border-white">
                            {t("logout")}
                        </button>
                    ) : (
                        <button onClick={() => navigate("/login")} className="bg-gray-900 px-4 py-2 rounded-lg border border-white">
                            {t("login")}
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
