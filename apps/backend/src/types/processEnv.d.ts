import { z } from 'zod';

const envVariables = z.object({
  NODE_ENV: z.string(),
  BACKEND_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_STRING: z.string(),
  JWT_TOKEN_SECRET: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
