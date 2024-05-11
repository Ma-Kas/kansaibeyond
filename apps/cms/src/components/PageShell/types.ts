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
      .min(1, { message: 'A post title is required.' })
      .max(150, { message: 'Post title must be under 150 characters' }),
    postSlug: z
      .string()
      .min(1, { message: 'URL slug cannot be empty.' })
      .max(50, { message: 'URL slug must be under 50 characters.' })
      .regex(urlSlugRegex, {
        message:
          'Invalid url slug format. Only lowercase letters and numbers. Hyphen instead of spaces.',
      }),
    content: z.string(),
    categories: z
      .array(z.number())
      .min(MIN_CATEGORIES_PER_POST, {
        message: 'Please assign at least one category to the post.',
      })
      .max(MAX_CATEGORIES_PER_POST, {
        message: `A maxiumum of ${MAX_CATEGORIES_PER_POST} categories can be assigned.`,
      }),
    tags: z
      .array(z.number())
      .min(MIN_TAGS_PER_POST, {
        message: 'Please assign at least one tag to the post.',
      })
      .max(MAX_TAGS_PER_POST, {
        message: `A maxiumum of ${MAX_TAGS_PER_POST} tags can be assigned.`,
      }),
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'A post title is required.' })
      .max(150, { message: 'Post title must be under 150 characters' }),
    postSlug: z
      .string()
      .min(1, { message: 'URL slug cannot be empty.' })
      .max(50, { message: 'URL slug must be under 50 characters.' })
      .regex(urlSlugRegex, {
        message:
          'Invalid url slug format. Only lowercase letters and numbers. Hyphen instead of spaces.',
      }),
    content: z.string(),
    coverImage: z
      .object({
        urlSlug: z
          .string()
          .min(1, { message: 'Please select a featured image.' }),
        altText: z.string().min(1, {
          message: 'Featured image alternative text cannot be empty.',
        }),
      })
      .strict(),
    status: z
      .union(
        [
          z.literal('published'),
          z.literal('draft'),
          z.literal('pending'),
          z.literal('trash'),
        ],
        { errorMap: () => ({ message: 'Invalid status option.' }) }
      )
      .optional(),
    categories: z
      .array(z.number())
      .min(MIN_CATEGORIES_PER_POST, {
        message: 'Please assign at least one category to the post.',
      })
      .max(MAX_CATEGORIES_PER_POST, {
        message: `A maxiumum of ${MAX_CATEGORIES_PER_POST} categories can be assigned.`,
      }),
    tags: z
      .array(z.number())
      .min(MIN_TAGS_PER_POST, {
        message: 'Please assign at least one tag to the post.',
      })
      .max(MAX_TAGS_PER_POST, {
        message: `A maxiumum of ${MAX_TAGS_PER_POST} tags can be assigned.`,
      }),
    relatedPosts: z
      .array(z.number())
      .max(MAX_RELATED_POSTS, {
        message: `A maxiumum of ${MAX_RELATED_POSTS} posts can be set as related posts.`,
      })
      .optional(),
  })
  .strict();

export type NewPost = z.infer<typeof newPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
