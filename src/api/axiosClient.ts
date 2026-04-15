import axios from "axios";
import useAuthStore from "@/stores/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

    // Nếu không phải lỗi 401 hoặc request này đã từng retry rồi thì thôi
    if (error.response?.status !== 401 || originalRequest._retry) {
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
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      // QUAN TRỌNG: Dùng axios instance mới hoàn toàn, không có interceptor
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        { refreshToken },
      );

      const newToken = data.result.token;
      if (newToken) console.log("refresh token");
      // Cập nhật Store (nên lưu cả cặp token mới nếu backend trả về cả hai)
      useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Xử lý Logout
      useAuthStore.getState().logout();
      localStorage.removeItem("refreshToken");

      // Chỉ redirect nếu không phải đang ở trang login
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
