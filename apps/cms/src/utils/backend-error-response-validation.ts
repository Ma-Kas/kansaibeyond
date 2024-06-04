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

export const loginSetFormFieldError = (errMessage: string) => {
  switch (errMessage) {
    case 'User not found.': {
      return { field: 'username', error: 'Username not found.' };
    }
    case 'Wrong password.': {
      return {
        field: 'password',
        error: 'The password you entered is incorrect.',
      };
    }
    case 'Account disabled.': {
      return null;
    }
    default: {
      return { field: null, error: errMessage };
    }
  }
};

export const signupSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const usernameArr = ['username', 'Username'];
    const emailArr = ['email', 'Email', 'tagSlug'];
    const displayNameArr = ['display_name', 'displayName', ' Display Name'];
    if (stringsInString(usernameArr, errMessage)) {
      return { field: 'username', error: 'This username already exists.' };
    } else if (stringsInString(emailArr, errMessage)) {
      return { field: 'email', error: 'This email address is already in use.' };
    } else if (stringsInString(displayNameArr, errMessage)) {
      return {
        field: 'displayName',
        error: 'This display name is already in use.',
      };
    } else {
      return { field: null, error: errMessage };
    }
  }
};

export const tagSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const tagNameArr = ['tag_name', 'Tag Name', 'tagName'];
    const tagSlugArr = ['tag_slug', 'Tag Slug', 'tagSlug'];
    if (stringsInString(tagNameArr, errMessage)) {
      return { field: 'tagName', error: 'This tag name already exists.' };
    } else if (stringsInString(tagSlugArr, errMessage)) {
      return { field: 'tagSlug', error: 'This url slug already exists.' };
    } else {
      return { field: null, error: errMessage };
    }
  }
};

export const affiliateSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const blogNameArr = ['blog_name', 'Blog Name', 'blogName'];
    const blogUrlArr = ['blog_url', 'Blog Url', 'blogUrl'];
    if (stringsInString(blogNameArr, errMessage)) {
      return { field: 'blogName', error: 'This blog name already exists.' };
    } else if (stringsInString(blogUrlArr, errMessage)) {
      return { field: 'blogUrl', error: 'This blog url already exists.' };
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
      return {
        field: 'categoryName',
        error: 'This category name already exists.',
      };
    } else if (stringsInString(categorySlugArr, errMessage)) {
      return { field: 'categorySlug', error: 'This url slug already exists.' };
    } else {
      return { field: null, error: errMessage };
    }
  }
};

export const postSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const postTitleArr = ['title', 'Title'];
    const postSlugArr = ['post_slug', 'Post Slug', 'postSlug'];
    if (stringsInString(postTitleArr, errMessage)) {
      return {
        field: null,
        error: 'This post title already exists.',
      };
    } else if (stringsInString(postSlugArr, errMessage)) {
      return { field: 'postSlug', error: 'This post url slug already exists.' };
    } else {
      return { field: null, error: errMessage };
    }
  }
};

export const userSetFormFieldError = (errMessage: string) => {
  if (!errMessage.includes('SequelizeUniqueConstraintError')) {
    // Not an error that should be displayed in form fields
    return { field: null, error: errMessage };
  } else {
    const usernameArr = ['username', 'Username', 'userName'];
    const emailArr = ['email', 'Email'];
    const displayNameArr = [
      'displayName',
      'displayname',
      'display_name',
      'Display Name',
      'display name',
    ];
    if (stringsInString(usernameArr, errMessage)) {
      return {
        field: 'username',
        error: 'This username already exists.',
      };
    } else if (stringsInString(emailArr, errMessage)) {
      return { field: 'email', error: 'This email address is already in use.' };
    } else if (stringsInString(displayNameArr, errMessage)) {
      return {
        field: 'displayName',
        error: 'This display name is already in use.',
      };
    } else {
      return { field: null, error: errMessage };
    }
  }
};
