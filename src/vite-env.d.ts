/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: "http://localhost:8081/api/v1"
  // thêm các biến env khác ở đây sau này
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}