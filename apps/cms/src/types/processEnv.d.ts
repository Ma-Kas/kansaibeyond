import { z } from 'zod';

const envVariables = z.object({
  BACKEND_BASE_URL_DEV: z.string(),
  BACKEND_BASE_URL_PRODUCTION: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
