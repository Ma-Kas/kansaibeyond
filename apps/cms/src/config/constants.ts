export const MIN_CATEGORIES_PER_POST = 1;
export const MAX_CATEGORIES_PER_POST = 3;
export const MIN_TAGS_PER_POST = 1;
export const MAX_TAGS_PER_POST = 10;
export const MAX_RELATED_POSTS = 3;

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  TECH: 'TECH',
  WRITER: 'WRITER',
  GUEST: 'GUEST',
} as const;

export const SELECTABLE_USER_ROLES = {
  ADMIN: 'ADMIN',
  TECH: 'TECH',
  WRITER: 'WRITER',
  GUEST: 'GUEST',
} as const;

export const HEADER_ABOUT_LINK = import.meta.env.VITE_HEADER_ABOUT_LINK;
export const KANSAIBEYOND_EMAIL = 'kansaibeyond@gmail.com';
export const READ_TIME_WORDS_PER_MINUTE = 270;

export const OWNER_USERNAME = import.meta.env.VITE_OWNER_USERNAME;

export const BACKEND_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_BASE_URL_DEV
  : import.meta.env.VITE_BACKEND_BASE_URL_PROD;

export const FRONTEND_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_FRONTEND_BASE_URL_DEV
  : import.meta.env.VITE_FRONTEND_BASE_URL_PROD;

export const REVALIDATION_SECRET = import.meta.env.VITE_REVALIDATION_SECRET;
export const REVALIDATION_TAGS = {
  posts: 'posts',
  postUpdated: 'postUpdated',
  userUpdated: 'userUpdated',
  categories: 'categories',
  categoryUpdated: 'categoryUpdated',
  tags: 'tags',
  tagUpdated: 'tagUpdated',
  affiliates: 'affiliates',
  socialMediaReel: 'socialMediaReel',
} as const;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_MEDIA_LIBRARY_WIDGET_SCRIPT_URL =
  'https://media-library.cloudinary.com/global/all.js';
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
export const WSRV_BASE_URL = 'https://wsrv.nl/?url=';
export const WSRV_TRANSFORM = '&output=webp&n=-1';
export const CATEGORY_LIST_THUMB_TRANSFORM = '/c_fill,w_100,q_60,f_auto';
export const POST_LIST_THUMB_TRANSFORM = '/c_fill,w_100,q_60,f_auto';
export const COVER_IMAGE_EDIT_TRANSFORM = '/c_fill,w_450,q_50,f_auto';
export const FEATURED_IMAGE_EDIT_TRANSFORM = '/c_fill,w_350,q_50,f_auto';
export const USER_LIST_THUMB_TRANSFORM = '/c_fill,w_100,q_50,f_auto';
export const USER_ICON_EDIT_TRANSFORM = '/c_fill,w_200,q_50,f_auto';

export const EDITOR_SINGLE_IMAGE_TRANSFORM = '/c_fill,w_740,q_auto,f_auto';
export const EDITOR_GALLERY_IMAGE_TRANSFORM = '/c_fill,w_450,q_auto,f_auto';
export const EDITOR_CAROUSEL_IMAGE_TRANSFORM = '/c_fill,w_740,q_auto,f_auto';
