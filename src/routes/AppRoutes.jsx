import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardHome from "../pages/DashboardHome";
import DiveFormPage from "../pages/DiveFormPage";
import DiveListPage from "../pages/DiveListPage";
import StatsPage from "../pages/StatsPage";
import ProfilePage from "../pages/PofilePage";
import DashboardLayout from "../layouts/DashboardLayout";
import LeaderboardPage from "../pages/LeaderboardPage";
import CommunitydPage from "../pages/CommunityPage";
import AboutPage from "../pages/AboutPage";

export default function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signin />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/community" element={<CommunitydPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="log" element={<DiveFormPage />} />
            <Route path="list" element={<DiveListPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
