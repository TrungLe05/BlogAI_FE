/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: "http://192.168.1.13:8081/api/v1";
  // thêm các biến env khác ở đây sau này
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
