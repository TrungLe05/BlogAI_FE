import ProtectedRoute from "@/shared/components/common/ProtectedRoute";
import BlogDetailPage from "@/pages/BlogDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import ExplorePage from "@/pages/ExplorePage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import MessagingPage from "@/pages/MessagingPage";
import OAuth2Callback from "@/pages/Oauth2Callback";
import RegisterPage from "@/pages/RegisterPage";
import TwoFactorPage from "@/pages/TwoFactorPage";
import UserDetailPage from "@/pages/UserDetailPage";
import { Route, Routes } from "react-router-dom";
import Layout from "@/shared/components/layout/Layout";

export default function Router() {
  return (
    <>
      <Routes>
        {/* No layout wrapper — full-screen pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/auth/2fa-verify-otp-code" element={<TwoFactorPage />} />

        {/* Pages with Header + Footer layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/user/:userId" element={<UserDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}
