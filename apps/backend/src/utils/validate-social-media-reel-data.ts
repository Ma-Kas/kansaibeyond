import { z } from 'zod';
import { NewSocialMediaReel, UpdateSocialMediaReel } from '../types/types';
import zodSchemaParser from './zod-schema-parser';

import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const reelImageSchema = z.object({
  urlSlug: z.string(),
  altText: z.string(),
});

// prettier-ignore
const reelDataSchema = z.object(
  {
    id: z.number(),
    url: z.string(),
    image: reelImageSchema,
  }
).strict();

// prettier-ignore
const newUpdateReelSchema = z.object(
  {
    reelData: z.array(reelDataSchema)
  }
).strict();

const validateNewSocialMediaReel = (input: unknown): NewSocialMediaReel => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('reelData' in input)) {
    throw new BadRequestError({ message: 'Reel Data is required.' });
  }

  return zodSchemaParser(newUpdateReelSchema, input);
};

const validateUpdateReel = (input: unknown): UpdateSocialMediaReel | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('reelData' in input)) {
    return null;
  }

  return zodSchemaParser(newUpdateReelSchema, input);
};

export { validateNewSocialMediaReel, validateUpdateReel };
