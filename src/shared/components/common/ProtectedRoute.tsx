import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/features/auth/stores/authStore";
import LoadingSpinner from "./LoadingSpinner";
import useWebSocketStore from "@/features/messages/stores/websocketStore";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { accessToken, _hasHydrated, user } = useAuthStore();
  const { connect } = useWebSocketStore();

  useEffect(() => {
    if (!accessToken || !user?.id) return;
    connect(accessToken, user.id); // guard nằm trong connect()
  }, [accessToken, user?.id]); // deps đơn giản, không có isConnected

  if (!_hasHydrated) return <LoadingSpinner />;
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
