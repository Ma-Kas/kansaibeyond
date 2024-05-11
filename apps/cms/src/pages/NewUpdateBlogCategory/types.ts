import { z } from 'zod';

const urlSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// prettier-ignore
export const categorySchema = z.object(
    {
      categoryName: z
        .string()
        .min(1, { message: 'Category name cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      categorySlug: z
        .string()
        .min(1, { message: 'URL slug cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' })
        .regex(urlSlugRegex, { message: 'Invalid format. Only lowercase letters and numbers. Hyphen instead of spaces.' }),
      description: z.string().optional(),
      coverImage: z.object(
        {
          urlSlug: z.string().min(1, { message: 'Please select a category image' }),
          altText: z.string().min(1, { message: 'Category image alternative text cannot be empty.' }),
        }  
      ).strict(),
    }
  ).strict();

export type Category = z.infer<typeof categorySchema>;
