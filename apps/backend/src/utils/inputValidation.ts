import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { NewUser, UpdateUser, CategoryExId } from '../types/types';
import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const stringSchema = z.string();
const newUserSchema = z
  .object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    displayName: z.string(),
    password: z.string(),
  })
  .strict();

// Type Validation with Error Handling
const parseStringInput = (input: unknown, path: string): string => {
  const parseResult = stringSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.issues[0];
    // Path array of ZodError is empty, as only single string is parsed
    // thus manual path is passed as second argument to function
    throw new BadRequestError({
      message: `Validation error: ${error.message.toString()} at "${path}";`,
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

  if (!('firstName' in input)) {
    throw new BadRequestError({ message: 'First Name is required.' });
  }

  if (!('lastName' in input)) {
    throw new BadRequestError({ message: 'Last Name is required.' });
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

  const parseResult = newUserSchema.safeParse(input);

  if (!parseResult.success) {
    const validationError = fromZodError(parseResult.error, {
      includePath: true,
    });
    throw new BadRequestError({ message: validationError.toString() });
  }

  return parseResult.data;

  // return {
  //   username: parseStringInput(input.username, 'username'),
  //   firstName: parseStringInput(input.firstName, 'firstName'),
  //   lastName: parseStringInput(input.lastName, 'lastName'),
  //   email: parseStringInput(input.email, 'email'),
  //   displayName: parseStringInput(input.displayName, 'displayName'),
  //   password: parseStringInput(input.password, 'password'),
  // };
};

const validateUserUpdate = (input: unknown): UpdateUser | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (
    !('username' in input) &&
    !('userIcon' in input) &&
    !('firstName' in input) &&
    !('lastName' in input) &&
    !('email' in input) &&
    !('displayName' in input) &&
    !('password' in input)
  ) {
    return null;
  }

  const updateData: UpdateUser = {};

  if ('username' in input) {
    updateData.username = parseStringInput(input.username, 'username');
  }

  if ('userIcon' in input) {
    updateData.userIcon = parseStringInput(input.userIcon, 'userIcon');
  }

  if ('firstName' in input) {
    updateData.firstName = parseStringInput(input.firstName, 'firstName');
  }

  if ('lastName' in input) {
    updateData.lastName = parseStringInput(input.lastName, 'lastName');
  }

  if ('email' in input) {
    updateData.email = parseStringInput(input.email, 'email');
  }

  if ('displayName' in input) {
    updateData.displayName = parseStringInput(input.displayName, 'displayName');
  }

  if ('password' in input) {
    updateData.password = parseStringInput(input.password, 'password');
  }

  return updateData;
};

const validateNewCategory = (input: unknown): CategoryExId => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('categoryName' in input)) {
    throw new BadRequestError({ message: 'CategoryName is required.' });
  }

  return {
    categoryName: parseStringInput(input.categoryName, 'categoryName'),
  };
};

const validateCategoryUpdate = (input: unknown): CategoryExId | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('categoryName' in input)) {
    return null;
  }

  return {
    categoryName: parseStringInput(input.categoryName, 'categoryName'),
  };
};

export {
  validateNewUser,
  validateUserUpdate,
  validateNewCategory,
  validateCategoryUpdate,
};
