import { z } from 'zod';
import { BACKEND_BASE_URL } from '@/config/constants';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

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

export type SocialMediaReelType = z.infer<typeof socialMediaReelSchema>;

export const getSocialMediaReel = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/social-media-reels`, {
      next: { tags: ['socialMediaReel'] },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedSocialMediaReel = socialMediaReelSchema.parse(data);
    return parsedSocialMediaReel;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
