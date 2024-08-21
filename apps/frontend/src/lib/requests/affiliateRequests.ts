import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import { allAffiliatesSchema } from '@/types/request-schemas';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

export const getAllAffiliates = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/affiliates`, {
      next: { tags: [REVALIDATION_TAGS.affiliates] },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedAffiliates = allAffiliatesSchema.parse(data);
    return parsedAffiliates;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
