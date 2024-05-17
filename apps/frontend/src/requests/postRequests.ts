import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const coverImageSchema = z.object(
  {
    altText: z.string(),
    urlSlug: z.string(),
  }
).strict();

// prettier-ignore
const postStatusSchema = z.union([
  z.literal('published'),
  z.literal('draft'),
  z.literal('pending'),
  z.literal('trash'),
]);

// prettier-ignore
const postUserSchema = z.object(
  {
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    status: z.string(),
  }
).strict();

// prettier-ignore
const postRelatedSchema = z.object(
  {
    id: z.number(),
    title: z.string(),
  }
).strict();

// prettier-ignore
const postCategorySchema = z.object(
  {
    id: z.number(),
    categoryName: z.string(),
    categorySlug: z.string(),
  }
).strict();

// prettier-ignore
const postTagSchema = z.object(
  {
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
  }
).strict();

// prettier-ignore
const postCommentSchema = z.object(
  {
    id: z.number(),
    content: z.string(),
    name: z.string().nullable(),
    user: z.object(
      {
        username: z.string()
      }
    ).strict().nullable()
  }
).strict();

// prettier-ignore
const getPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: postUserSchema,
    relatedPosts: z.array(postRelatedSchema).optional(),
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
    comments: z.array(postCommentSchema)
  }
).strict();

export type Post = z.infer<typeof getPostSchema>;

const getAllPostsSchema = z.array(getPostSchema);

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/posts`);
    return getAllPostsSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOnePost = async (postSlug: string) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/posts/${postSlug}`);
    return getPostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
