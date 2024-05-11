import { z } from 'zod';

const urlSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// prettier-ignore
export const tagSchema = z.object(
    {
      tagName: z
        .string()
        .min(1, { message: 'Tag name cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      tagSlug: z
        .string()
        .min(1, { message: 'URL slug cannot be empty.' })
        .max(50, { message: 'URL slug must be under 50 characters.' })
        .regex(urlSlugRegex, { message: 'Invalid format. Only lowercase letters and numbers. Hyphen instead of spaces.' }),
    }
  ).strict();

export type Tag = z.infer<typeof tagSchema>;
