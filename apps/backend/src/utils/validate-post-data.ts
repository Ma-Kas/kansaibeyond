import { z } from 'zod';
import { NewPostValidationResult, UpdatePost } from '../types/types';
import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

import { MAX_CATEGORIES_PER_POST, MAX_TAGS_PER_POST } from './constants';

// Zod Schemas
const postMediaSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
});

// prettier-ignore
const newPostSchema = z.object(
  {
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    media: postMediaSchema,
    tags: z.number().array().max(MAX_TAGS_PER_POST),
    categories: z.number().array().max(MAX_CATEGORIES_PER_POST),
  }
).strict();

// prettier-ignore
const updatePostSchema = z.object(
  {
    postSlug: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    media: postMediaSchema.optional(),
    tags: z.number().array().max(MAX_TAGS_PER_POST).optional(),
    categories: z.number().array().max(MAX_CATEGORIES_PER_POST).optional(),
  }
).strict();

const validateNewPostData = (input: unknown): NewPostValidationResult => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('postSlug' in input)) {
    throw new BadRequestError({ message: 'Route Name is required.' });
  }

  if (!('title' in input)) {
    throw new BadRequestError({ message: 'Post Title is required.' });
  }

  if (!('content' in input)) {
    throw new BadRequestError({ message: 'Post Content is required.' });
  }

  if (!('media' in input)) {
    throw new BadRequestError({ message: 'Media is required.' });
  }

  if (!('tags' in input)) {
    throw new BadRequestError({ message: 'Tags are required.' });
  }

  if (!('categories' in input)) {
    throw new BadRequestError({ message: 'Categories are required.' });
  }

  const parseResult = zodSchemaParser(newPostSchema, input);

  return {
    postData: {
      postSlug: parseResult.postSlug,
      title: parseResult.title,
      content: parseResult.content,
      media: parseResult.media,
    },
    categories: parseResult.categories,
    tags: parseResult.tags,
  };
};

const validatePostUpdateData = (input: unknown): UpdatePost | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (
    !('postSlug' in input) &&
    !('title' in input) &&
    !('content' in input) &&
    !('media' in input) &&
    !('tags' in input) &&
    !('categories' in input)
  ) {
    return null;
  }

  return zodSchemaParser(updatePostSchema, input);
};

export { validateNewPostData, validatePostUpdateData };
