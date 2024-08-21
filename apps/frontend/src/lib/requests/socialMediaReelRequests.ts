import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import { socialMediaReelSchema } from '@/types/request-schemas';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

export const getSocialMediaReel = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/social-media-reels`, {
      next: { tags: [REVALIDATION_TAGS.socialMediaReel] },
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
