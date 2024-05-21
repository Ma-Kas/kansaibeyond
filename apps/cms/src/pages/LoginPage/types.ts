import { z } from 'zod';

// prettier-ignore
export const loginSchema = z.object(
    {
      username: z
        .string()
        .min(1, { message: 'Please provide a username.' }),
      password: z
        .string()
        .min(1, { message: 'Please provide a password.' }),

    }
  ).strict();

export type LoginType = z.infer<typeof loginSchema>;
