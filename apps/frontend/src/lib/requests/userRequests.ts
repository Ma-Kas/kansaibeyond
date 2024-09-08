import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import {
  publicUserSchema,
  allPublicUsersSchema,
} from '@/types/request-schemas';
import CustomError from '@/utils/custom-error';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users`, {
      next: { tags: [REVALIDATION_TAGS.userUpdated] },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedUsers = allPublicUsersSchema.parse(data);
    return parsedUsers;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getOneUser = async (username: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/${username}`, {
      next: { tags: [REVALIDATION_TAGS.userUpdated] },
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

    const parsedUser = publicUserSchema.parse(data);
    return parsedUser;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
