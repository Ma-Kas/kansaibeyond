import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const authSchema = z.object(
  {
    id: z.number(),
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: z.string(),
  }
).strict().nullable();

export const getAuth = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/auth/`);
    return authSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
