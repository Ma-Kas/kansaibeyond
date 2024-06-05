import { z } from 'zod';

// prettier-ignore
export const affiliateSchema = z.object(
    {
      blogName: z
        .string()
        .min(1, { message: 'Blog name cannot be empty.' }),
      blogUrl: z
        .string()
        .min(1, { message: 'Blog URL cannot be empty.' })
        .url({message: 'Please provide a valid url.'}),
      blogDescription: z
        .string()
        .min(1, { message: 'Blog description cannot be empty.' }),
      userId: z
        .number()
        .or(z.string())
        .optional()
        .nullable(),
    }
  ).strict();

export type Affiliate = z.infer<typeof affiliateSchema>;
