import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import { tagSchema, allTagsSchema } from '@/types/request-schemas';
import CustomError from '@/utils/custom-error';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';

export const getAllTags = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tags`, {
      next: { tags: [REVALIDATION_TAGS.tags, REVALIDATION_TAGS.tagUpdated] },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedTags = allTagsSchema.parse(data);
    return parsedTags;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getOneTag = async (tagSlug: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tags/${tagSlug}`, {
      next: { tags: [tagSlug, REVALIDATION_TAGS.tagUpdated] },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      } else {
        throw new CustomError({
          digest: response.statusText,
          message: response.statusText,
        });
      }
    }

    const data: unknown = await response.json();

    const parsedTag = tagSchema.parse(data);
    return parsedTag;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
