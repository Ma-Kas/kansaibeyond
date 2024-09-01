/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_OWNER_USERNAME: string;
  readonly VITE_BACKEND_BASE_URL_DEV: string;
  readonly VITE_BACKEND_BASE_URL_PROD: string;
  readonly VITE_REVALIDATION_SECRET: string;
  readonly VITE_FRONTEND_BASE_URL_DEV: string;
  readonly VITE_FRONTEND_BASE_URL_PROD: string;
  readonly VITE_CLOUDINARY_BASE_URL: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_HEADER_ABOUT_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
