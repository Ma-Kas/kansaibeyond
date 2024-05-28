import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// prettier-ignore
const loginReturnSchema = z.string();

export const postLogin = async (loginData: unknown) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/login`, loginData);
    return loginReturnSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
