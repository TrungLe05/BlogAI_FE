import axios from "axios";
import useAuthStore from "@/stores/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - giữ nguyên
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - thêm refresh token logic
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Không phải 401 hoặc đã retry rồi → reject bình thường
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // Đang refresh → đưa vào hàng đợi chờ token mới
    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );

      const newToken = data.result.token;

      // Cập nhật store
      useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user);

      // Flush queue
      queue.forEach((cb) => cb(newToken));
      queue = [];

      // Retry request gốc
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);
    } catch {
      // Refresh thất bại → logout hẳn
      useAuthStore.getState().logout();
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;