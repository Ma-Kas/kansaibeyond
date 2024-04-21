import { z } from 'zod';

// prettier-ignore
export const tagSchema = z.object(
    {
      tagName: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' }),
      tagSlug: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' }),
    }
  ).strict();

export type Tag = z.infer<typeof tagSchema>;
