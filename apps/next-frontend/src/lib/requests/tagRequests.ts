import { z } from 'zod';
import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL } from '@/config/constants';
import CustomError from '@/utils/custom-error';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const tagPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
  }
).strict();

// prettier-ignore
const tagSchema = z.object(
  {
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
    posts: z.array(tagPostSchema),
  }
).strict();

export type Tag = z.infer<typeof tagSchema>;

const allTagsSchema = z.array(tagSchema);

export const getAllTags = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tags`);

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
    const response = await fetch(`${BACKEND_BASE_URL}/tags/${tagSlug}`);

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
