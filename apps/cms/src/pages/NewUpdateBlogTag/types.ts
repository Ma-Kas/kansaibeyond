import { z } from 'zod';

const urlSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
        .max(100, { message: 'Must be under 100 characters.' })
        .regex(urlSlugRegex, { message: 'Invalid format. Only lowercase letters and numbers. Hyphen instead of spaces.' }),
    }
  ).strict();

export type Tag = z.infer<typeof tagSchema>;
