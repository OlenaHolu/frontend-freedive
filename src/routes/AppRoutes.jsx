import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardHome from "../pages/DashboardHome";
import DiveAddPage from "../pages/DiveAddPage";
import DiveListPage from "../pages/DiveListPage";
import StatsPage from "../pages/StatsPage";
import ProfilePage from "../pages/PofilePage";
import DashboardLayout from "../layouts/DashboardLayout";
import AboutPage from "../pages/AboutPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import ContactPage from "../pages/ContactPage";
import DiveEditPage from "../pages/DiveEditPage";
import DiveDetailsPage from "../pages/DiveDetailsPage";

export default function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />
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
