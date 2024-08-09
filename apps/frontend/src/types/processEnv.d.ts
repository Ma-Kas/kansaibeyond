import { z } from 'zod';

const envVariables = z.object({
  BACKEND_BASE_URL_DEV: z.string(),
  BACKEND_BASE_URL_PROD: z.string(),
  CMS_BASE_URL_DEV: z.string(),
  CMS_BASE_URL_PROD: z.string(),
  FRONTEND_BASE_URL_DEV: z.string(),
  FRONTEND_BASE_URL_PROD: z.string(),
  NEXT_PUBLIC_CLOUDINARY_BASE_URL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  REVALIDATION_SECRET: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
