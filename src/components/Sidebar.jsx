import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Plus, ClipboardList, BarChart2 } from "lucide-react";

const Sidebar = ({ mobile }) => {
  const { t } = useTranslation();

  const linkClass =
    "py-2 px-4 flex items-center gap-2 hover:bg-blue-600 transition rounded text-sm md:text-base font-medium";

  // Movile

  const baseClasses =
    "flex flex-col items-center text-xs transition duration-200";

  const activeClass =
    "text-blue-400";

  const hoverClass =
    "hover:text-blue-300";

  if (mobile) {
    return (
      <nav className="fixed bottom-0 left-0 w-full bg-black bg-opacity-95 text-white flex justify-around py-2 z-50 shadow-lg md:hidden">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : ""} ${hoverClass}`
          }
        >
          <User size={22} />
          <span>{t("sidebar.profile")}</span>
        </NavLink>

        <NavLink
          to="/dashboard/log"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : ""} ${hoverClass}`
          }
        >
          <Plus size={22} />
          <span>{t("sidebar.log")}</span>
        </NavLink>

        <NavLink
          to="/dashboard/list"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : ""} ${hoverClass}`
          }
        >
          <ClipboardList size={22} />
          <span>{t("sidebar.list")}</span>
        </NavLink>

        <NavLink
          to="/dashboard/stats"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : ""} ${hoverClass}`
          }
        >
          <BarChart2 size={22} />
          <span>{t("sidebar.stats")}</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col min-h-screen shadow-lg">
      <nav className="space-y-3">
        <NavLink to="/dashboard/profile" className={linkClass}>
          <User size={20} />
          {t("sidebar.profile")}
        </NavLink>
        <NavLink to="/dashboard/log" className={linkClass}>
          <Plus size={20} />
          {t("sidebar.log")}
        </NavLink>
        <NavLink to="/dashboard/list" className={linkClass}>
          <ClipboardList size={20} />
          {t("sidebar.list")}
        </NavLink>
        <NavLink to="/dashboard/stats" className={linkClass}>
          <BarChart2 size={20} />
          {t("sidebar.stats")}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
