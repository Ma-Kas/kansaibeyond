import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';

// Zod Schemas
// prettier-ignore
const tagPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
  }
).strict();

// prettier-ignore
const tagSchema = z.object(
  {
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
    posts: z.array(tagPostSchema),
  }
).strict();

const allTagsSchema = z.array(tagSchema);

type TagType = {
  tagName: string;
  tagSlug: string;
};

export const getAllTags = async () => {
  const response = await axios.get(`${BACKEND_BASE_URL}/tags`);
  return allTagsSchema.parse(response.data);
};

export const getOneTag = async (tagSlug: string) => {
  const response = await axios.get(`${BACKEND_BASE_URL}/tags/${tagSlug}`);
  return tagSchema.parse(response.data);
};

export const postTag = async (tagData: TagType) => {
  const response = await axios.post(`${BACKEND_BASE_URL}/tags`, tagData);
  return response.data;
};

export const updateTag = async (tagData: TagType) => {
  console.log(tagData);
  const response = await axios.put(
    `${BACKEND_BASE_URL}/tags/${tagData.tagSlug}`,
    tagData
  );
  return response.data;
};

// Response can be 200 if ok, 400, 401,404, 500 otherwise
