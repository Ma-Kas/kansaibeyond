import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import { authSchema } from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

export const getAuth = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/auth/`);
    return authSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
