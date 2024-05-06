import { z } from 'zod';
import {
  MIN_CATEGORIES_PER_POST,
  MAX_CATEGORIES_PER_POST,
  MIN_TAGS_PER_POST,
  MAX_TAGS_PER_POST,
  MAX_RELATED_POSTS,
} from '../../config/constants';

const urlSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const newPostSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: 'Must be at least 2 characters long.' })
      .max(150, { message: 'Must be under 150 characters.' }),
    postSlug: z
      .string()
      .min(2, { message: 'Must be at least 2 characters long.' })
      .max(100, { message: 'Must be under 100 characters.' })
      .regex(urlSlugRegex, {
        message:
          'Invalid format. Only lowercase letters and numbers. Hyphen instead of spaces.',
      }),
    content: z.string(),
    coverImage: z
      .object({
        urlSlug: z.string().min(2, { message: 'Please select a cover image' }),
        altText: z
          .string()
          .min(2, { message: 'Must be at least 2 characters long.' }),
      })
      .strict(),
    categories: z
      .array(z.number())
      .min(MIN_CATEGORIES_PER_POST, {
        message: 'At least one category must be selected.',
      })
      .max(MAX_CATEGORIES_PER_POST, {
        message: `A maxiumum of ${MAX_CATEGORIES_PER_POST} can be selected`,
      }),
    tags: z
      .array(z.number())
      .min(MIN_TAGS_PER_POST, {
        message: 'At least one tag must be selected.',
      })
      .max(MAX_TAGS_PER_POST, {
        message: `A maxiumum of ${MAX_TAGS_PER_POST} can be selected`,
      }),
    relatedPosts: z
      .array(z.number())
      .max(MAX_RELATED_POSTS, {
        message: `A maxiumum of ${MAX_RELATED_POSTS} can be selected`,
      })
      .optional(),
  })
  .strict();

export type NewPost = z.infer<typeof newPostSchema>;
