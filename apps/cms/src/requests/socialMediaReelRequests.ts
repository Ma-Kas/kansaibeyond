import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
const reelImageSchema = z.object({
  urlSlug: z.string(),
  altText: z.string(),
});

// prettier-ignore
const reelDataSchema = z.object(
  {
    id: z.number(),
    url: z.string(),
    image: reelImageSchema,
  }
).strict();

// prettier-ignore
const socialMediaReelSchema = z.object(
  {
    id: z.number(),
    reelData: z.array(reelDataSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
  }
).strict();

export const getSocialMediaReel = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/social-media-reels`);
    return socialMediaReelSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateSocialMediaReel = async (id: number, reelData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/social-media-reels/${id}`,
      reelData
    );
    return socialMediaReelSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
