export const BACKEND_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.BACKEND_BASE_URL_DEV
    : process.env.BACKEND_BASE_URL_PROD;

export const CMS_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.CMS_BASE_URL_DEV
    : process.env.CMS_BASE_URL_PROD;

export const FRONTEND_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.FRONTEND_BASE_URL_DEV
    : process.env.FRONTEND_BASE_URL_PROD;

export const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
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
};

export const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? 'localhost'
    : 'kansaibeyond.com';

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  TECH: 'TECH',
  WRITER: 'WRITER',
  GUEST: 'GUEST',
} as const;

export const PAGINATION_PAGE_SIZE = 12;

// External Data
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
export const GOOGLE_TAG_MANAGER_CONTAINER_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID;

export const INSTAGRAM_SCRIPT_URL = 'https://www.instagram.com/embed.js';
export const SITENAME = 'Kansai & Beyond';

export const KANSAIBEYOND_EMAIL = 'kansaibeyond@gmail.com';
export const KANSAIBEYOND_THATCH = 'https://www.thatch.co/@kansai';
export const KANSAIBEYOND_THATCH_HK_FOOD =
  'https://www.thatch.co/guide/2v5gfojl4v2on/view';
export const KANSAIBEYOND_TWITTER = 'https://x.com/kansaibeyond';
export const KANSAIBEYOND_TWITTER_HANDLE = '@kansaibeyond';
export const KANSAIBEYOND_INSTAGRAM = 'https://www.instagram.com/kansaibeyond';
export const KANSAIBEYOND_YOUTUBE =
  'https://www.youtube.com/channel/UCOX-Lsp71XRKLP0S38LegCA';

// Cloudinary Image Transformation Constants
export const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL;
export const WSRV_BASE_URL = 'https://wsrv.nl/?url=';
// For animated stuff to work, wsrv needs a transform param of n=-1 to return all frames
export const WSRV_TRANSFORM = '&output=webp&n=-1';
export const USER_ICON_IMAGE_TRANSFORM = '/c_fill,w_64,q_70,f_auto';
export const LOADING_PLACEHOLDER_IMAGE_TRANSFORM = '/c_fill,w_8,q_1,f_auto';
export const CATEGORY_CARD_IMAGE_TRANSFORM = '/c_fill,w_600,q_auto,f_auto';
export const CATEGORY_BANNER_IMAGE_TRANSFORM = '/c_fill,w_1920,q_auto,f_auto';
export const POST_FEATURED_IMAGE_TRANSFORM = '/c_fill,w_1100,q_auto,f_auto';
export const POST_CARD_IMAGE_TRANSFORM = '/c_fill,w_600,q_auto,f_auto';
export const SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM = '/c_fill,w_560,q_auto,f_auto';

export const POST_SINGLE_IMAGE_TRANSFORM = '/c_fill,w_740,q_auto,f_auto';
export const POST_GALLERY_IMAGE_TRANSFORM = '/c_fill,w_640,q_auto,f_auto';
export const POST_CAROUSEL_IMAGE_TRANSFORM = '/c_fill,w_740,q_auto,f_auto';

export const METADATA_IMAGE_TRANSFORM = '/c_fill,w_1200,q_auto,f_auto';
