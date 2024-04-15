import { z } from 'zod';
import { NewAffiliate, UpdateAffiliate } from '../types/types';
import zodSchemaParser from './zod-schema-parser';

import BadRequestError from '../errors/BadRequestError';

// Zod Schemas

// prettier-ignore
const newAffiliateSchema = z.object(
  {
    blogName: z.string(),
    blogUrl: z.string().url(),
    blogDescription: z.string(),
    userId: z.number().optional(),
  }
).strict();

// prettier-ignore
const updateAffiliateSchema = z.object(
  {
    blogName: z.string().optional(),
    blogUrl: z.string().url().optional(),
    blogDescription: z.string().optional(),
    userId: z.number().optional(),
  }
).strict();

const validateNewAffiliate = (input: unknown): NewAffiliate => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('blogName' in input)) {
    throw new BadRequestError({ message: 'blogName is required.' });
  }

  if (!('blogUrl' in input)) {
    throw new BadRequestError({ message: 'blogUrl is required.' });
  }

  if (!('blogDescription' in input)) {
    throw new BadRequestError({ message: 'blogDescription is required.' });
  }

  return zodSchemaParser(newAffiliateSchema, input);
};

const validateAffiliateUpdate = (input: unknown): UpdateAffiliate | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (
    !('blogName' in input) &&
    !('blogUrl' in input) &&
    !('blogDescription' in input) &&
    !('userId' in input)
  ) {
    return null;
  }

  return zodSchemaParser(updateAffiliateSchema, input);
};

export { validateNewAffiliate, validateAffiliateUpdate };
