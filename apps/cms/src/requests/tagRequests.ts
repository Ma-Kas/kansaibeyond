import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';

// Axios instances (for interceptors)
const getInstance = axios.create({
  baseURL: `${BACKEND_BASE_URL}/tags`,
  timeout: 1000,
});

const postPutInstance = axios.create({
  baseURL: `${BACKEND_BASE_URL}/tags`,
  timeout: 1000,
});

const deleteInstance = axios.create({
  baseURL: `${BACKEND_BASE_URL}/tags`,
  timeout: 1000,
});

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
  const response = await getInstance.get(`/`);
  return allTagsSchema.parse(response.data);
};

export const getOneTag = async (tagSlug: string) => {
  const response = await getInstance.get(`/${tagSlug}`);
  return tagSchema.parse(response.data);
};

// TODO: Error formatting and forward to display
export const postTag = async (tagData: TagType) => {
  try {
    const response = await postPutInstance.post(`/`, tagData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.errors[0].message as string);
    }
  }
};

export const updateTag = async (urlSlug: string, tagData: TagType) => {
  console.log(tagData);
  const response = await postPutInstance.put(`/${urlSlug}`, tagData);
  return response.data;
};

export const deleteTag = async (tagSlug: string) => {
  const response = await deleteInstance.delete(`/${tagSlug}`);
  return response.data;
};

// Response can be 200 if ok, 400, 401, 404, 500 otherwise
