import { z } from 'zod';
import { NewPostValidationResult, UpdatePost } from '../types/types';
import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

import {
  MAX_CATEGORIES_PER_POST,
  MAX_TAGS_PER_POST,
  MAX_RELATED_POSTS,
} from './constants';

// Zod Schemas
const postCoverImageSchema = z.object({
  urlSlug: z.string(),
  altText: z.string(),
});

const postStatusSchema = z.union([
  z.literal('published'),
  z.literal('draft'),
  z.literal('pending'),
  z.literal('trash'),
]);

// prettier-ignore
const newPostSchema = z.object(
  {
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    coverImage: postCoverImageSchema.optional(),
    status: postStatusSchema.optional(),
    tags: z.number().array().min(1).max(MAX_TAGS_PER_POST),
    categories: z.number().array().min(1).max(MAX_CATEGORIES_PER_POST),
    relatedPosts: z.number().array().max(MAX_RELATED_POSTS).optional(),
  }
).strict();

// prettier-ignore
const updatePostSchema = z.object(
  {
    postSlug: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    coverImage: postCoverImageSchema.optional(),
    status: postStatusSchema.optional(),
    readTime:z.number().optional(),
    tags: z.number().array().min(1).max(MAX_TAGS_PER_POST).optional(),
    categories: z.number().array().min(1).max(MAX_CATEGORIES_PER_POST).optional(),
    relatedPosts: z.number().array().max(MAX_RELATED_POSTS).optional(),
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
      coverImage: parseResult.coverImage,
      status: parseResult.status,
    },
    categories: parseResult.categories,
    tags: parseResult.tags,
    relatedPosts: parseResult.relatedPosts,
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
    !('coverImage' in input) &&
    !('status' in input) &&
    !('readTime' in input) &&
    !('tags' in input) &&
    !('categories' in input) &&
    !('relatedPosts' in input)
  ) {
    return null;
  }

  const parseResult = zodSchemaParser(updatePostSchema, input);

  // No postData updated, only associated categories, tags or relatedPosts
  if (
    !parseResult.postSlug &&
    !parseResult.title &&
    !parseResult.content &&
    !parseResult.coverImage &&
    !parseResult.status &&
    !parseResult.readTime
  ) {
    return {
      postData: undefined,
      categories: parseResult.categories,
      tags: parseResult.tags,
      relatedPosts: parseResult.relatedPosts,
    };
  }

  // postData updated
  return {
    postData: {
      postSlug: parseResult.postSlug,
      title: parseResult.title,
      content: parseResult.content,
      coverImage: parseResult.coverImage,
      status: parseResult.status,
      readTime: parseResult.readTime,
    },
    categories: parseResult.categories,
    tags: parseResult.tags,
    relatedPosts: parseResult.relatedPosts,
  };
};

export { validateNewPostData, validatePostUpdateData };
