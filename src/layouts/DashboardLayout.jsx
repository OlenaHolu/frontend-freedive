import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      {/* Sidebar mobile */}
      <div className="md:hidden">
        <Sidebar mobile />
      </div>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-24 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
