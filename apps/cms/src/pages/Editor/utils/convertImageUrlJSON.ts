import {
  CLOUDINARY_BASE_URL,
  WSRV_BASE_URL,
  WSRV_TRANSFORM,
} from '../../../config/constants';

export const stripImageUrl = (url: string, transform: string): string => {
  const toStrip = `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${transform}`;
  return url.replace(toStrip, '').replace(WSRV_TRANSFORM, '');
};

export const createImageUrl = (base: string, transform: string): string => {
  return `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${transform}${base}${WSRV_TRANSFORM}`;
};
