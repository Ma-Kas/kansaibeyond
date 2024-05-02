import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Takes in any zod schema and input, returns data if validation succeeds
// Throws correct validation error if not
const zodSchemaParser = <T extends z.ZodTypeAny>(schema: T, input: unknown) => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const validationError = fromZodError(result.error, {
      includePath: true,
    });
    throw new Error(validationError.toString());
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data as z.infer<T>;
  }
};

export default zodSchemaParser;
