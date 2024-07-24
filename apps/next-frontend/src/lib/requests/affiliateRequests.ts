import { z } from 'zod';
import { BACKEND_BASE_URL, USER_ROLES } from '@/config/constants';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

// Zod Schemas
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
const affiliateSchema = z.object(
  {
    id: z.number(),
    blogName: z.string(),
    blogUrl: z.string(),
    blogDescription: z.string(),
    user: postUserSchema.nullable(),
  }
).strict();

export type Affiliate = z.infer<typeof affiliateSchema>;

const allAffiliatesSchema = z.array(affiliateSchema);

export const getAllAffiliates = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/affiliates`);

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedAffiliates = allAffiliatesSchema.parse(data);
    return parsedAffiliates;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
