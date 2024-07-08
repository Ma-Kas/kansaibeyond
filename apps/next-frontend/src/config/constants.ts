export const BACKEND_BASE_URL = process.env.DEV
  ? process.env.BACKEND_BASE_URL_DEV
  : process.env.BACKEND_BASE_URL_PROD;

export const INSTAGRAM_SCRIPT_URL = 'https://www.instagram.com/embed.js';
export const KANSAIBEYOND_EMAIL = 'kansaibeyond@gmail.com';
export const KANSAIBEYOND_THATCH = 'https://www.thatch.co/@kansai';
export const KANSAIBEYOND_TWITTER = 'https://x.com/kansaibeyond';
export const KANSAIBEYOND_INSTAGRAM = 'https://www.instagram.com/kansaibeyond';
export const KANSAIBEYOND_YOUTUBE =
  'https://www.youtube.com/channel/UCOX-Lsp71XRKLP0S38LegCA';

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL;
export const LOADING_PLACEHOLDER_IMAGE_TRANSFORM = '/c_fill,w_10,q_auto,f_auto';
export const CATEGORY_CARD_IMAGE_TRANSFORM = '/c_fill,w_350,q_auto,f_auto';
export const CATEGORY_BANNER_IMAGE_TRANSFORM = '/c_fill,w_1920,q_60,f_auto';
export const POST_FEATURED_IMAGE_TRANSFORM = '/c_fill,w_1100,q_auto,f_auto';
export const POST_CARD_IMAGE_TRANSFORM = '/c_fill,w_350,q_auto,f_auto';

export const POST_SINGLE_IMAGE_TRANSFORM = '/c_fill,w_800,q_auto,f_auto';
export const POST_GALLERY_IMAGE_TRANSFORM = '/c_fill,w_500,q_auto,f_auto';
export const POST_CAROUSEL_IMAGE_TRANSFORM = '/c_fill,w_800,q_auto,f_auto';
