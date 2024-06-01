import { z } from 'zod';

// prettier-ignore
const userContactSchema = z.object(
  {
    email: z
      .string()
      .max(100, { message: 'Must be under 100 characters.' })
      .email({ message: 'Please provide a valid email address.' })
      .optional(),
    homepage: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional(),
    twitter: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional(),
    instagram: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional(),
    youtube: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional(),
    linkedin: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional(),
  }
).strict();

// prettier-ignore
export const updateUserSchema = z.object(
    {
      username: z
        .string()
        .min(1, { message: 'Username cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      email: z
        .string()
        .min(1, { message: 'Email cannot be empty.' })
        .max(100, { message: 'Must be under 100 characters.' })
        .email({ message: 'Please provide a valid email address.' }),
      displayName: z
        .string()
        .min(1, { message: 'Display name cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      password: z.string().optional(),
      userIcon: z.string().optional(),
      firstName: z
        .string()
        .min(1, { message: 'First name cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      lastName: z
        .string()
        .min(1, { message: 'Last name cannot be empty.' })
        .max(50, { message: 'Must be under 50 characters.' }),
      introduction: z.string().optional(),
      contact: userContactSchema.optional()
    }
  ).strict();

export type UpdateUserType = z.infer<typeof updateUserSchema>;
