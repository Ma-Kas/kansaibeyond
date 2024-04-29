/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_BACKEND_BASE_URL_DEV: string;
  readonly VITE_BACKEND_BASE_URL_PROD: string;
  readonly VITE_CLOUDINARY_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
