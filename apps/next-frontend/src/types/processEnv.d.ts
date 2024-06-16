import { z } from 'zod';

const envVariables = z.object({
  BACKEND_BASE_URL_DEV: z.string(),
  BACKEND_BASE_URL_PROD: z.string(),
  CLOUDINARY_BASE_URL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
