import { CategoryExId } from '../types/types';
import { parseStringInput } from './validation-helpers';

import BadRequestError from '../errors/BadRequestError';

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

export { validateNewCategory, validateCategoryUpdate };
