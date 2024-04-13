import { z } from 'zod';
import { NewTag, UpdateTag } from '../types/types';
import zodSchemaParser from './zod-schema-parser';

import BadRequestError from '../errors/BadRequestError';

// prettier-ignore
const newTagSchema = z.object(
  {
    tagName: z.string(),
    tagSlug: z.string(),
  }
).strict();

// prettier-ignore
const updateTagSchema = z.object(
  {
    tagName: z.string().optional(),
    tagSlug: z.string().optional(),
  }
).strict();

const validateNewTag = (input: unknown): NewTag => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('tagName' in input)) {
    throw new BadRequestError({ message: 'TagName is required.' });
  }

  if (!('tagSlug' in input)) {
    throw new BadRequestError({ message: 'TagSlug is required.' });
  }

  return zodSchemaParser(newTagSchema, input);
};

const validateTagUpdate = (input: unknown): UpdateTag | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (!('tagName' in input) && !('tagSlug' in input)) {
    return null;
  }

  return zodSchemaParser(updateTagSchema, input);
};

export { validateNewTag, validateTagUpdate };
