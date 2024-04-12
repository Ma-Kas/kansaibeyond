import { z } from 'zod';

import { NewUser, UpdateUser } from '../types/types';
import { parseStringInput } from './validation-helpers';

import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

// prettier-ignore
const newUserSchema = z.object(
  {
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    password: z.string(),
  }).strict();

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

  return zodSchemaParser(newUserSchema, input);
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

export { validateNewUser, validateUserUpdate };
