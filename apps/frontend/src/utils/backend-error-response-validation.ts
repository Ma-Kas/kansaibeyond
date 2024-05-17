import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const handleRequestErrors = (err: unknown) => {
  if (err === null) {
    throw new Error('Unexpected error!');
  }
  if (err instanceof AxiosError) {
    // Axios Errors, anything regarding actual response, request cycle
    const response = err.response;

    if (!response) {
      // Network errors pass along message
      throw new Error(err.message);
    }

    if (
      // Try to get custom error message from backend, else throw axios error message
      !response.data?.errors[0].message ||
      typeof response.data?.errors[0].message !== 'string'
    ) {
      throw new Error(err.message);
    } else {
      const message = response.data?.errors[0].message as string;
      throw new Error(message);
    }
  } else if (err instanceof ZodError) {
    // Error thrown during zod validation of received data
    const validationError = fromZodError(err, {
      includePath: true,
    });
    throw new Error(validationError.toString());
  } else {
    // Unhandled error, pass along message
    throw err;
  }
};
