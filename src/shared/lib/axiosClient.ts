import axios from "axios";
import useAuthStore from "@/features/auth/stores/authStore";

// Các endpoint không cần (và không nên) gắn Authorization header cũ —
// gọi lúc user chưa có access token hợp lệ, hoặc token cũ có thể đã hết hạn
// và việc gắn nó vào sẽ khiến oauth2ResourceServer chặn 401 trước khi tới
// được controller, bất kể endpoint có permitAll() hay không.
const NO_AUTH_HEADER_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/login/verify-otp",
  "/auth/introspect",
  "/auth/refresh-token",
  "/auth/oauth2/exchange",
];

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Bắt buộc để trình duyệt gửi/nhận cookie (refreshToken httpOnly) cho
  // request cross-site — thiếu dòng này, Set-Cookie từ response sẽ bị
  // trình duyệt âm thầm bỏ qua, không lưu.
  withCredentials: true,
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const isNoAuthPath = NO_AUTH_HEADER_PATHS.some((p) =>
    config.url?.includes(p),
  );
  if (!isNoAuthPath) {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không phải lỗi 401, request đã từng retry rồi, hoặc 401 này đến
    // từ chính 1 endpoint public (login/exchange/refresh-token...) thì
    // không cố refresh — 401 ở những endpoint này không có nghĩa "access
    // token hết hạn", nó là lỗi nghiệp vụ khác (sai mật khẩu, code đã dùng,
    // refresh token invalid...), refresh lại chỉ gây thêm 1 request thừa
    // và có thể loop.
    const isNoAuthPath = NO_AUTH_HEADER_PATHS.some((p) =>
      originalRequest.url?.includes(p),
    );
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isNoAuthPath
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Không còn đọc refreshToken từ localStorage — nó là cookie httpOnly,
      // JS không đọc được và cũng không cần đọc. Trình duyệt tự đính kèm
      // cookie này vào request nhờ withCredentials: true, backend đọc từ
      // cookie thay vì từ body.
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {},
        { withCredentials: true },
      );

      const newToken = data.result.token;
      useAuthStore
        .getState()
        .setAuth(newToken, "", useAuthStore.getState().user);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().logout();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
