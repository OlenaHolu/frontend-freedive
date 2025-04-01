import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import 'sweetalert2/dist/sweetalert2.min.css';
import Modal from "react-modal";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

export default function App() {
  const isOnline = useNetworkStatus();
  const { t } = useTranslation();
  const prevStatus = useRef(isOnline);

  useEffect(() => {
    if (prevStatus.current !== isOnline) {
      if (isOnline) {
        // ✅ Mostrar toast de reconexión solo cuando vuelve
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: t("network.restored", "Conexión restaurada"),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#16a34a",
          color: "#fff",
        });
      }
      prevStatus.current = isOnline;
    }
  }, [isOnline, t]);

  return (
    <AuthProvider>
      {/* 🔴 Banner visible todo el tiempo mientras no hay conexión */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm font-semibold shadow-md">
          {t("network.offline", "Sin conexión a internet")}
        </div>
      )}

      {/* Evitar que la app se solape con el banner */}
      <div className={!isOnline ? "pt-10" : ""}>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
