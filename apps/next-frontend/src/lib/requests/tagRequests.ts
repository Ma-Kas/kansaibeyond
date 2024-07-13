import { z } from 'zod';
import { BACKEND_BASE_URL } from '@/config/constants';

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
  const response = await fetch(`${BACKEND_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Tags fetch error\n');
  }

  const data: unknown = await response.json();

  const parsedTags = allTagsSchema.parse(data);
  return parsedTags;
};

export const getOneTag = async (tagSlug: string) => {
  const response = await fetch(`${BACKEND_BASE_URL}/tags/${tagSlug}`);

  if (!response.ok) {
    throw new Error('Tag fetch error\n');
  }

  const data: unknown = await response.json();

  const parsedTag = tagSchema.parse(data);
  return parsedTag;
};
