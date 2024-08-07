import { z } from 'zod';
import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, USER_ROLES } from '@/config/constants';
import CustomError from '@/utils/custom-error';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import { setSessionCookieHeader } from '@/utils/set-session-cookie-header';

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
const relatedPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: postUserSchema,
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
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
    relatedPosts: z.array(relatedPostSchema).optional(),
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
    comments: z.array(postCommentSchema).optional()
  }
).strict();

const listPostSchema = postSchema.omit({ content: true });
const postSlugListSchema = z.array(z.object({ postSlug: z.string() }).strict());

export type Post = z.infer<typeof postSchema>;
export type PostForList = z.infer<typeof listPostSchema>;
export type PostUser = z.infer<typeof postUserSchema>;

const allPostsSchema = z
  .object({ rows: z.array(listPostSchema), count: z.number() })
  .strict();

export const getAllPosts = async (queryParams?: string) => {
  try {
    const response = queryParams
      ? await fetch(`${BACKEND_BASE_URL}/posts${queryParams}`, {
          next: { tags: ['posts'] },
        })
      : await fetch(`${BACKEND_BASE_URL}/posts`, {
          next: {
            tags: [
              'posts',
              'postUpdated',
              'categoryUpdated',
              'tagUpdated',
              'userUpdated',
            ],
          },
        });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();
    const parsedPosts = allPostsSchema.parse(data);
    return parsedPosts;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getPostSlugList = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/post-slugs`, {
      next: { tags: ['posts'] },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();
    const parsedPostSlugList = postSlugListSchema.parse(data);
    return parsedPostSlugList;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getSearchPosts = async (queryParams: string) => {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/posts/search${queryParams}`,
      {
        next: {
          tags: [
            'posts',
            'postUpdated',
            'categoryUpdated',
            'tagUpdated',
            'userUpdated',
          ],
        },
      }
    );

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();
    const parsedPosts = allPostsSchema.parse(data);
    return parsedPosts;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getOnePost = async (postSlug: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/posts/${postSlug}`, {
      next: {
        tags: [
          postSlug,
          'postUpdated',
          'categoryUpdated',
          'tagUpdated',
          'userUpdated',
        ],
      },
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
    const parsedPost = postSchema.parse(data);
    return parsedPost;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

// Send along sessionId (if logged into CMS) in cookie to gain access
export const getOnePreviewPost = async (postSlug: string) => {
  const sessionCookie = setSessionCookieHeader();
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/preview/${postSlug}`, {
      cache: 'no-store',
      headers: {
        Cookie: sessionCookie,
      },
    });

    if (!response.ok) {
      // Cheeky hack to show not found page if visitor is not logged in, so as
      // to hide existence of preview route altogether
      if (response.status === 403 || response.status === 404) {
        notFound();
      } else {
        throw new CustomError({
          digest: response.statusText,
          message: response.statusText,
        });
      }
    }

    const data: unknown = await response.json();
    const parsedPost = postSchema.parse(data);
    return parsedPost;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
