import { z } from 'zod';
import { NewUser } from '../types/types';
import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const stringSchema = z.string();

// Type Validation with Error Handling
const validateStringInput = (input: unknown): string => {
  const parseResult = stringSchema.safeParse(input);
  if (!parseResult.success) {
    throw new BadRequestError({
      message: `Invalid input type on '${input}'. ${parseResult.error.issues[0].message}`,
    });
  }
  return parseResult.data;
};

// Exported Form Data Validators
const validateNewUser = (input: unknown): NewUser => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('username' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('password' in input)) {
    throw new BadRequestError({ message: 'Password is required' });
  }

  return {
    username: validateStringInput(input.username),
    password: validateStringInput(input.password),
  };
};

export { validateNewUser };
