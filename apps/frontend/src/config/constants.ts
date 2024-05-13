export const BACKEND_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_BASE_URL_DEV
  : import.meta.env.VITE_BACKEND_BASE_URL_PROD;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
export const CATEGORY_COVER_IMAGE_TRANSFORM = '/c_fill,w_100,q_60,f_auto';
export const POST_FEATURED_IMAGE_TRANSFORM = '/c_fill,w_450,q_50,f_auto';

export const POST_SINGLE_IMAGE_TRANSFORM = '/c_fill,w_800,q_auto,f_auto';
export const POST_GALLERY_IMAGE_TRANSFORM = '/c_fill,w_500,q_auto,f_auto';
export const POST_CAROUSEL_IMAGE_TRANSFORM = '/c_fill,w_800,q_auto,f_auto';
