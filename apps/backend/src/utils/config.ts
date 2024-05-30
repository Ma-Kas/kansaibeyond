import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

export const sameSiteSchema = z.union([
  z.literal('none'),
  z.literal('lax'),
  z.literal('strict'),
  z.boolean(),
]);

export type SameSiteType = z.infer<typeof sameSiteSchema>;

const DB_CONNECTION_STRING =
  process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_CONNECTION_STRING
    : process.env.DB_CONNECTION_STRING;
const BACKEND_PORT = process.env.BACKEND_PORT;

const CMS_URL =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? process.env.CMS_URL_DEV
    : process.env.CMS_URL_PROD;

const FRONTEND_URL =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? process.env.FRONTEND_URL_DEV
    : process.env.FRONTEND_URL_PROD;

const SESSION_DURATION_HOURS = 168; // 7days

const COOKIE_SAME_SITE_POLICY = process.env.COOKIE_SAME_SITE_POLICY;

export {
  DB_CONNECTION_STRING,
  BACKEND_PORT,
  CMS_URL,
  FRONTEND_URL,
  SESSION_DURATION_HOURS,
  COOKIE_SAME_SITE_POLICY,
};
