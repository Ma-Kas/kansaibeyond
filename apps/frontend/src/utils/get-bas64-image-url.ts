import {
  WSRV_BASE_URL,
  CLOUDINARY_BASE_URL,
  LOADING_PLACEHOLDER_IMAGE_TRANSFORM,
  WSRV_TRANSFORM,
} from '@/config/constants';

const getBase64ImageUrl = async (
  imageURLSlug: string
): Promise<string | undefined> => {
  const response = await fetch(
    `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${LOADING_PLACEHOLDER_IMAGE_TRANSFORM}${imageURLSlug}${WSRV_TRANSFORM}`
  );
  const buffer = await response.arrayBuffer();
  const data = Buffer.from(buffer).toString('base64');
  return `data:image/webp;base64,${data}`;
};

export default getBase64ImageUrl;
