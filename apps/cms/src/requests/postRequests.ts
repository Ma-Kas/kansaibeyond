import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import {
  getAllPostsSchema,
  getPostSchema,
  newUpdatePostSchema,
  deleteOneSchema as deletePostSchema,
} from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

export const getAllPosts = async (userFilter: string | null = null) => {
  try {
    const response = await axios.get(
      `${BACKEND_BASE_URL}/posts${userFilter ? `?filter=${userFilter}` : ''}`
    );
    return getAllPostsSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOnePost = async (postSlug: string) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/posts/${postSlug}`);
    return getPostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const postPost = async (postData: unknown) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/posts`, postData);
    return newUpdatePostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updatePost = async (urlSlug: string, postData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/posts/${urlSlug}`,
      postData
    );
    return newUpdatePostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const trashPost = async (postSlug: string) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/posts/${postSlug}/trash`
    );
    return deletePostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const deletePost = async (postSlug: string) => {
  try {
    const response = await axios.delete(
      `${BACKEND_BASE_URL}/posts/${postSlug}?force=true`
    );
    return deletePostSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
