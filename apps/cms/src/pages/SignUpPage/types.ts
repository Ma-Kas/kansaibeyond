import { z } from 'zod';

// prettier-ignore
export const signupSchema = z.object(
    {
      username: z
        .string()
        .min(1, { message: 'Please provide a username.' }),
      email: z
        .string()
        .min(1, { message: 'Please provide an email address.' })
        .email({ message: 'Please provide a valid email address.' }),
      password: z
        .string()
        .min(1, { message: 'Please provide a password.' }),
      displayName: z
        .string()
        .min(1, { message: 'Please provide a display name.' }),
      firstName: z
        .string()
        .min(1, { message: 'Please provide a first name.' }),
      lastName: z
        .string()
        .min(1, { message: 'Please provide a last name.' }),
    }
  ).strict();

export type LoginType = z.infer<typeof signupSchema>;
