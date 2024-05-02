import { z } from 'zod';

const urlSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// prettier-ignore
export const categorySchema = z.object(
    {
      categoryName: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' }),
      categorySlug: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' })
        .regex(urlSlugRegex, { message: 'Invalid format. Only lowercase letters and numbers. Hyphen instead of spaces.' }),
      description: z.string().optional(),
      coverImage: z.object(
        {
          urlSlug: z.string().min(2, { message: 'Please select a cover image' }),
          altText: z.string().min(2, { message: 'Must be at least 2 characters long.' }),
        }  
      ).strict(),
    }
  ).strict();

export type Category = z.infer<typeof categorySchema>;
