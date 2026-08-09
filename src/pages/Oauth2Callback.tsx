import Cookies from "js-cookie";
import { userApi } from "@/features/user/api/userApi";
import useAuthStore from "@/features/auth/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    console.log("All cookies:", document.cookie);

    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    console.log("accessToken from cookie:", accessToken);
    console.log("refreshToken from cookie:", refreshToken);

    if (!accessToken) {
      console.log("No accessToken found → back to login");
      navigate("/login", { replace: true });
      return;
    }

    setAuth(accessToken, null);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    userApi
      .getMe()
      .then((res) => {
        setAuth(accessToken, res.data.result);
        Cookies.remove("accessToken"); // xoá cookie sau khi đã lưu
        navigate("/dashboard", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  return null;
};

export default OAuth2Callback;
