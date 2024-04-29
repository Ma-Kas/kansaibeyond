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

const stringsInString = (arr: string[], string: string) => {
  return arr.some((item) => string.toLowerCase().includes(item.toLowerCase()));
};

export const tagSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const tagNameArr = ['tag_name', 'Tag Name', 'tagName'];
    const tagSlugArr = ['tag_slug', 'Tag Slug', 'tagSlug'];
    if (stringsInString(tagNameArr, errMessage)) {
      return { field: 'tagName', error: 'Tag Name already exists.' };
    } else if (stringsInString(tagSlugArr, errMessage)) {
      return { field: 'tagSlug', error: 'Tag Slug already exists.' };
    } else {
      return { field: null, error: errMessage };
    }
  }
};

export const categorySetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const categoryNameArr = ['category_name', 'Category Name', 'categoryName'];
    const categorySlugArr = ['category_slug', 'Category Slug', 'categorySlug'];
    if (stringsInString(categoryNameArr, errMessage)) {
      return { field: 'categoryName', error: 'Category Name already exists.' };
    } else if (stringsInString(categorySlugArr, errMessage)) {
      return { field: 'categorySlug', error: 'Category Slug already exists.' };
    } else {
      return { field: null, error: errMessage };
    }
  }
};
