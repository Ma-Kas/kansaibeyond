export const BACKEND_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.BACKEND_BASE_URL_DEV
    : process.env.BACKEND_BASE_URL_PRODUCTION;
