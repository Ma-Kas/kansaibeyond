import cors from 'cors';
import { CMS_URL, FRONTEND_URL } from './config';

// Set allowed origins in cors from .env
const setCorsOptions = (): cors.CorsOptions => {
  if (!CMS_URL || !FRONTEND_URL) {
    return {
      credentials: true,
    };
  }
  return {
    credentials: true,
    origin: [CMS_URL, FRONTEND_URL],
  };
};

export default setCorsOptions;
