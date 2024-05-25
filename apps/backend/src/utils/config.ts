import dotenv from 'dotenv';
dotenv.config();

const DB_CONNECTION_STRING =
  process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_CONNECTION_STRING
    : process.env.DB_CONNECTION_STRING;
const BACKEND_PORT = process.env.BACKEND_PORT;
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

const CMS_URL =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? process.env.CMS_URL_DEV
    : process.env.CMS_URL_PROD;

const FRONTEND_URL =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? process.env.FRONTEND_URL_DEV
    : process.env.FRONTEND_URL_PROD;

const SESSION_DURATION_HOURS = 168; // 7days

export {
  DB_CONNECTION_STRING,
  BACKEND_PORT,
  JWT_TOKEN_SECRET,
  CMS_URL,
  FRONTEND_URL,
  SESSION_DURATION_HOURS,
};
