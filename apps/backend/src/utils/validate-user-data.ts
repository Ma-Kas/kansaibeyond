import { z } from 'zod';

import { NewUser, UpdateUser } from '../types/types';

import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

// prettier-ignore
const newUserSchema = z.object(
  {
    username: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }
).strict();

const userStatusSchema = z.union([
  z.literal('Admin'),
  z.literal('Tech'),
  z.literal('Writer'),
  z.literal('Guest'),
]);

// prettier-ignore
const updateUserSchema = z.object(
  {
    username: z.string().optional(),
    email: z.string().email().optional(),
    displayName: z.string().optional(),
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    introduction: z.string().optional(),
    contact: z.object(
      {
        email: z.string().email().optional().nullable(),
        homepage: z.string().url().optional().nullable(),
        twitter: z.string().url().optional().nullable(),
        instagram: z.string().url().optional().nullable(),
        youtube: z.string().url().optional().nullable(),
        linkedin: z.string().url().optional().nullable(),
    }).optional(),
    disabled: z.boolean().optional(),
    status: userStatusSchema.optional()
  }
).strict();

const validateNewUser = (input: unknown): NewUser => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('username' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('email' in input)) {
    throw new BadRequestError({ message: 'Email is required.' });
  }

  if (!('displayName' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('password' in input)) {
    throw new BadRequestError({ message: 'Password is required' });
  }

  if (!('firstName' in input)) {
    throw new BadRequestError({ message: 'First Name is required.' });
  }

  if (!('lastName' in input)) {
    throw new BadRequestError({ message: 'Last Name is required.' });
  }

  return zodSchemaParser(newUserSchema, input);
};

const validateUserUpdate = (input: unknown): UpdateUser | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (
    !('username' in input) &&
    !('email' in input) &&
    !('displayName' in input) &&
    !('password' in input) &&
    !('userIcon' in input) &&
    !('firstName' in input) &&
    !('lastName' in input) &&
    !('introduction' in input) &&
    !('contact' in input) &&
    !('disabled' in input) &&
    !('status' in input)
  ) {
    return null;
  }

  return zodSchemaParser(updateUserSchema, input);
};

export { validateNewUser, validateUserUpdate };
