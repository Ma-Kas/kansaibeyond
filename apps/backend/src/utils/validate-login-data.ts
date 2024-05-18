import { z } from 'zod';

import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

// prettier-ignore
const LoginDataSchema = z.object(
  {
    username: z.string(),
    password: z.string(),
  }
).strict();

type LoginData = z.infer<typeof LoginDataSchema>;

const validateLoginData = (input: unknown): LoginData => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('username' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('password' in input)) {
    throw new BadRequestError({ message: 'Password is required' });
  }

  return zodSchemaParser(LoginDataSchema, input);
};

export { validateLoginData };
