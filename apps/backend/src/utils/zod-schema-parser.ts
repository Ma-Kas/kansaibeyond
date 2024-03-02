import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import BadRequestError from '../errors/BadRequestError';

// Takes in any zod schema and input, returns data if validation succeeds
// Throws correct validation error if not
const zodSchemaParser = (schema: z.Schema, input: unknown) => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const validationError = fromZodError(result.error, {
      includePath: true,
    });
    throw new BadRequestError({ message: validationError.toString() });
  }
  return result.data;
};

export default zodSchemaParser;
