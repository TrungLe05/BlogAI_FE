import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { userApi } from "@/features/user/api/userApi";
import useAuthStore from "@/features/auth/stores/authStore";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuthStore();

  // StrictMode (dev) chạy useEffect 2 lần — code exchange chỉ dùng được
  // một lần, nên phải tự chặn lần gọi thứ 2 ở phía client, không dựa vào
  // backend từ chối rồi mới xử lý (sẽ kéo theo refresh-token không cần thiết).
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    console.log(code);
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    // Đổi mã tạm (dùng một lần, sống 30s) lấy accessToken thật qua response
    // body — không còn đọc token từ cookie/URL nữa.
    authApi
      .exchangeOAuthCode(code)
      .then(({ data }) => {
        const accessToken = data.result.accessToken;
        console.log(accessToken);
        auth.setAuth(accessToken, "", null);
        console.log(auth.accessToken);
        return userApi.getMe().then((res) => {
          auth.setAuth(accessToken, "", res.data.result);
          navigate("/dashboard", { replace: true });
        });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  return null;
};

export default OAuth2Callback;
