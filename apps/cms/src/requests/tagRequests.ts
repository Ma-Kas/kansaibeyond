import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

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

const newUpdateTagSchema = tagSchema.omit({ posts: true });

// prettier-ignore
const deleteTagSchema = z.object(
  {
    message: z.string(),
  }
).strict();

export const getAllTags = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/tags`);
    return allTagsSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOneTag = async (tagSlug: string) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/tags/${tagSlug}`);
    return tagSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const postTag = async (tagData: unknown) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/tags`, tagData);
    return newUpdateTagSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateTag = async (urlSlug: string, tagData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/tags/${urlSlug}`,
      tagData
    );
    return newUpdateTagSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const deleteTag = async (tagSlug: string) => {
  try {
    const response = await axios.delete(`${BACKEND_BASE_URL}/tags/${tagSlug}`);
    return deleteTagSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
