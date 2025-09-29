import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardHome from "../pages/DashboardHome/DashboardHome";
import DiveAddPage from "../pages/DiveAddPage";
import DiveListPage from "../pages/DiveListPage";
import StatsPage from "../pages/StatsPage/StatsPage";
import ProfilePage from "../pages/PofilePage/PofilePage";
import DashboardLayout from "../layouts/DashboardLayout";
import AboutPage from "../pages/AboutPage/AboutPage";
import PrivacyPage from "../pages/PrivacyPage/PrivacyPage";
import TermsPage from "../pages/TermsPage/TermsPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import DiveEditPage from "../pages/DiveEditPage";
import DiveDetailsPage from "../pages/DiveDetailsPage";
import GoogleCallback from "../pages/GoogleCallback";

export default function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="log" element={<DiveAddPage />} />
            <Route path="list" element={<DiveListPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="dives/:diveId" element={<DiveDetailsPage />} />
            <Route path="dives/edit/:diveId" element={<DiveEditPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
  );
}
