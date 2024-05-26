import cors from 'cors';
import { CMS_URL, FRONTEND_URL } from './config';

// Set allowed origins in cors from .env
const setCMSCorsOptions = (): cors.CorsOptions => {
  if (!CMS_URL) {
    return {
      credentials: true,
    };
  }
  return {
    credentials: true,
    origin: [CMS_URL],
  };
};

// Set allowed origins in cors from .env
const setFrontendCorsOptions = (): cors.CorsOptions => {
  if (!FRONTEND_URL) {
    return {
      credentials: true,
    };
  }
  return {
    credentials: true,
    origin: [FRONTEND_URL],
  };
};

export { setCMSCorsOptions, setFrontendCorsOptions };
