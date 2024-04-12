import { z } from 'zod';
import { NewPostValidationResult, UpdatePost } from '../types/types';
import { parseStringInput } from './validation-helpers';
import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const numberArraySchema = z.number().array();

const postMediaSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
});

const postTagSchema = z.array(z.string());

// prettier-ignore
const newPostSchema = z.object(
  {
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    media: postMediaSchema,
    tags: postTagSchema,
    categories: z.number().array(),
  }
).strict();

// prettier-ignore
const updatePostSchema = z.object(
  {
    postSlug: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    media: postMediaSchema.optional(),
    tags: postTagSchema.optional(),
    categories: z.number().array().optional(),
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
      tags: parseResult.tags,
    },
    categories: parseResult.categories,
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

  const updateData: UpdatePost = {};

  if ('postSlug' in input) {
    updateData.postSlug = parseStringInput(input.postSlug, 'postSlug');
  }

  if ('title' in input) {
    updateData.title = parseStringInput(input.title, 'title');
  }

  if ('content' in input) {
    updateData.content = parseStringInput(input.content, 'content');
  }

  if ('media' in input) {
    updateData.media = zodSchemaParser(postMediaSchema, input.media);
  }

  if ('tags' in input) {
    updateData.tags = zodSchemaParser(postTagSchema, input.tags);
  }

  if ('categories' in input) {
    updateData.categories = zodSchemaParser(
      numberArraySchema,
      input.categories
    );
  }

  return updateData;

  return zodSchemaParser(updatePostSchema, input);
};

export { validateNewPostData, validatePostUpdateData };
