import { CLOUDINARY_BASE_URL } from '../../../config/constants';

export const stripImageUrl = (url: string, transform: string): string => {
  const toStrip = `${CLOUDINARY_BASE_URL}${transform}`;
  return url.replace(toStrip, '');
};

export const createImageUrl = (base: string, transform: string): string => {
  return `${CLOUDINARY_BASE_URL}${transform}${base}`;
};
