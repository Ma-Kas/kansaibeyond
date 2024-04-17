import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import zodSchemaParser from '../utils/zod-schema-parser';

// Zod Schemas
const tagPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
  })
  .strict();

const tagSchema = z
  .object({
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
    posts: z.array(tagPostSchema),
  })
  .strict();

const allTagsSchema = z.array(tagSchema);

export const getAllTags = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/tags`);
    const rawData = (await response.data) as unknown;
    const validated = validateTagResponseData(rawData);
    return validated;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(err.message);
    } else {
      throw new Error('Malformed response data');
    }
  }
};

const validateTagResponseData = (input: unknown) => {
  return zodSchemaParser(allTagsSchema, input);
};
