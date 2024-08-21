import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import CustomError from '@/utils/custom-error';
import {
  postSchema,
  allPostsSchema,
  postSlugListSchema,
} from '@/types/request-schemas';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import { setSessionCookieHeader } from '@/utils/set-session-cookie-header';

export const getAllPosts = async (queryParams?: string) => {
  try {
    const response = queryParams
      ? await fetch(`${BACKEND_BASE_URL}/posts${queryParams}`, {
          next: {
            tags: [
              REVALIDATION_TAGS.posts,
              REVALIDATION_TAGS.postUpdated,
              REVALIDATION_TAGS.categoryUpdated,
              REVALIDATION_TAGS.tagUpdated,
              REVALIDATION_TAGS.userUpdated,
            ],
          },
        })
      : await fetch(`${BACKEND_BASE_URL}/posts`, {
          next: {
            tags: [
              REVALIDATION_TAGS.posts,
              REVALIDATION_TAGS.postUpdated,
              REVALIDATION_TAGS.categoryUpdated,
              REVALIDATION_TAGS.tagUpdated,
              REVALIDATION_TAGS.userUpdated,
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
      next: { tags: [REVALIDATION_TAGS.postUpdated] },
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
            REVALIDATION_TAGS.posts,
            REVALIDATION_TAGS.postUpdated,
            REVALIDATION_TAGS.categoryUpdated,
            REVALIDATION_TAGS.tagUpdated,
            REVALIDATION_TAGS.userUpdated,
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
          REVALIDATION_TAGS.postUpdated,
          REVALIDATION_TAGS.categoryUpdated,
          REVALIDATION_TAGS.tagUpdated,
          REVALIDATION_TAGS.userUpdated,
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
