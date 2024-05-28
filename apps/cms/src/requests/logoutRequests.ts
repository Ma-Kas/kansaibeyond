import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// prettier-ignore
const logoutReturnSchema = z.string();

export const deleteLogout = async () => {
  try {
    const response = await axios.delete(`${BACKEND_BASE_URL}/logout`);
    return logoutReturnSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
