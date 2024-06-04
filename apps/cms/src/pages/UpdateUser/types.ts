import { z } from 'zod';

// prettier-ignore
const userContactSchema = z.object(
  {
    email: z
      .string()
      .max(100, { message: 'Must be under 100 characters.' })
      .email({ message: 'Please provide a valid email address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
    homepage: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
    twitter: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
    instagram: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
    youtube: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
    linkedin: z
      .string()
      .url({ message: 'Please provide a valid address.' })
      .optional()
      .or(z.literal(''))
      .nullable(),
  }
).strict();

export type UpdateUserContactType = z.infer<typeof userContactSchema>;

// prettier-ignore
const updateUserSchema = z.object(
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
      introduction: z.string().optional().nullable(),
      contact: userContactSchema.optional()
    }
  ).strict();

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export { updateUserSchema };
