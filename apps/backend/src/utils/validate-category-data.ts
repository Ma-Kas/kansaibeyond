import { z } from 'zod';
import { NewCategory, UpdateCategory } from '../types/types';
import zodSchemaParser from './zod-schema-parser';

import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const categoryCoverImageSchema = z.object({
  urlSlug: z.string(),
  altText: z.string(),
});

// prettier-ignore
const newCategorySchema = z.object(
  {
    categoryName: z.string(),
    categorySlug: z.string(),
    description: z.string().optional(),
    coverImage: categoryCoverImageSchema.optional(),
  }
).strict();

// prettier-ignore
const updateCategorySchema = z.object(
  {
    categoryName: z.string().optional(),
    categorySlug: z.string().optional(),
    description: z.string().optional(),
    coverImage: categoryCoverImageSchema.optional(),
  }
).strict();

const validateNewCategory = (input: unknown): NewCategory => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('categoryName' in input)) {
    throw new BadRequestError({ message: 'CategoryName is required.' });
  }

  if (!('categorySlug' in input)) {
    throw new BadRequestError({ message: 'CategorySlug is required.' });
  }

  return zodSchemaParser(newCategorySchema, input);
};

const validateCategoryUpdate = (input: unknown): UpdateCategory | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (
    !('categoryName' in input) &&
    !('categorySlug' in input) &&
    !('description' in input) &&
    !('coverImage' in input)
  ) {
    return null;
  }

  return zodSchemaParser(updateCategorySchema, input);
};

export { validateNewCategory, validateCategoryUpdate };
