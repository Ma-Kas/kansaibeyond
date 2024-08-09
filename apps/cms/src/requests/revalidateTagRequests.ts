import axios from 'axios';
import { z } from 'zod';
import { FRONTEND_BASE_URL, REVALIDATION_SECRET } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// prettier-ignore
const revalidationResultSchema = z.object(
  {
    revalidated: z.string(),
    now: z.string(),
  }
).strict();

export const postRevalidation = async (revalidationTag: unknown) => {
  const revalidationData = {
    tag: revalidationTag,
    secret: REVALIDATION_SECRET,
  };

  try {
    const response = await axios.post(
      `${FRONTEND_BASE_URL}/api/revalidate`,
      revalidationData
    );
    return revalidationResultSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
