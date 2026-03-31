import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute() {
  const { accessToken, _hasHydrated } = useAuthStore();
  console.log("ProtectedRoute accessToken:", accessToken); // debug

  // Đang load → không redirect vội
  if (!_hasHydrated) return <LoadingSpinner />;
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
