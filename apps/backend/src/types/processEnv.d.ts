import { z } from 'zod';
import { sameSiteSchema } from '../utils/config';

const envVariables = z.object({
  NODE_ENV: z.string(),
  BACKEND_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_STRING: z.string(),
  DB_TEST_PASSWORD: z.string(),
  DB_TEST_CONNECTION_STRING: z.string(),
  JWT_TOKEN_SECRET: z.string(),
  CMS_URL_DEV: z.string(),
  CMS_URL_PROD: z.string(),
  FRONTEND_URL_DEV: z.string(),
  FRONTEND_URL_PROD: z.string(),
  COOKIE_SAME_SITE_POLICY: sameSiteSchema,
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
