export const BACKEND_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_BASE_URL_DEV
  : import.meta.env.VITE_BACKEND_BASE_URL_PROD;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_MEDIA_LIBRARY_WIDGET_SCRIPT_URL =
  'https://media-library.cloudinary.com/global/all.js';
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
export const CATEGORY_LIST_THUMB_TRANSFORM = '/c_fill,w_100,q_60,f_auto';
export const COVER_IMAGE_EDIT_TRANSFORM = '/c_fill,w_450,q_50,f_auto';
