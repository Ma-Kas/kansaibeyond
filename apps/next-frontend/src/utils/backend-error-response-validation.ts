import { ZodError } from 'zod';
import CustomError from './custom-error';
import { isNotFoundError } from 'next/dist/client/components/not-found';

export const ERRORS_DICTIONARY = {
  UNEXPECTED_ERROR: 'Unexpected Error',
  BAD_REQUEST: 'Bad Request Error',
  SERVER_ERROR: 'Server Error',
  NOT_FOUND: 'Not Found',
};

export const handleRequestErrors = (err: unknown) => {
  // Error should not be null, early escape hatch
  if (err === null) {
    throw new CustomError({
      digest: ERRORS_DICTIONARY.UNEXPECTED_ERROR,
      message: ERRORS_DICTIONARY.UNEXPECTED_ERROR,
    });
  } else if (err instanceof CustomError) {
    // Error returned from backend, meaning database or server error
    throw err;
  } else if (isNotFoundError(err)) {
    // Forcing Next.js NotFoundPage rendering
    throw err;
  } else if (err instanceof ZodError) {
    // Error thrown during zod validation of received data
    throw new CustomError({
      digest: ERRORS_DICTIONARY.BAD_REQUEST,
      message: ERRORS_DICTIONARY.BAD_REQUEST,
    });
  } else if (err instanceof Error && err.message === 'fetch failed') {
    // Next.js fetching error
    throw new CustomError({
      digest: ERRORS_DICTIONARY.SERVER_ERROR,
      message: ERRORS_DICTIONARY.SERVER_ERROR,
    });
  } else {
    // Any remaining unhandled errors
    throw new CustomError({
      digest: ERRORS_DICTIONARY.UNEXPECTED_ERROR,
      message: ERRORS_DICTIONARY.UNEXPECTED_ERROR,
    });
  }
};
