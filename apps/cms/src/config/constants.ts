export const BACKEND_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_BASE_URL_DEV
  : import.meta.env.VITE_BACKEND_BASE_URL_PROD;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
export const CATEGORY_LIST_THUMB_TRANSFORM = '/c_fill,w_100,q_60';
