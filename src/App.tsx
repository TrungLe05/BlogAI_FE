import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import ExplorePage from "@/pages/ExplorePage";
import ProfilePage from "@/pages/ProfilePage";
import StatisticsPage from "@/pages/StatisticsPage";
import OAuth2Callback from "./pages/Oauth2Callback";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "sonner";
export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* No layout wrapper — full-screen pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />

          {/* Pages with Header + Footer layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/blog/:blogId" element={<BlogDetailPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/stats" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
