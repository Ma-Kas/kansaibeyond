import { z } from 'zod';
import { BACKEND_BASE_URL, USER_ROLES } from '@/config/constants';

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

const userRoleSchema = z.union([
  z.literal(USER_ROLES.OWNER),
  z.literal(USER_ROLES.ADMIN),
  z.literal(USER_ROLES.TECH),
  z.literal(USER_ROLES.WRITER),
  z.literal(USER_ROLES.GUEST),
]);

// prettier-ignore
const postUserSchema = z.object(
  {
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: userRoleSchema,
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
const postSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: postUserSchema,
    relatedPosts: z.array(postRelatedSchema).optional(),
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
    comments: z.array(postCommentSchema)
  }
).strict();

const listPostSchema = postSchema.omit({ content: true });

export type Post = z.infer<typeof postSchema>;
export type PostForList = z.infer<typeof listPostSchema>;
export type PostUser = z.infer<typeof postUserSchema>;

const allPostsSchema = z.array(listPostSchema);

export const getAllPosts = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Post List fetch error\n');
  }

  const data: unknown = await response.json();
  console.log(data);
  const parsedPosts = allPostsSchema.parse(data);
  return parsedPosts;
};

export const getOnePost = async (postSlug: string) => {
  const response = await fetch(`${BACKEND_BASE_URL}/posts/${postSlug}`);
  if (!response.ok) {
    throw new Error('Post fetch error\n');
  }

  const data: unknown = await response.json();
  const parsedPost = postSchema.parse(data);
  return parsedPost;
};
