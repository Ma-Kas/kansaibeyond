import { z } from 'zod';
import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const stringSchema = z.string();
const numberSchema = z.number();

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

const parseNumberInput = (input: unknown, path: string): number => {
  const parseResult = numberSchema.safeParse(input);
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

export { parseStringInput, parseNumberInput };
