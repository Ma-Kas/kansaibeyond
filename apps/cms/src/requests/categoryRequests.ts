import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const categoryPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
  }
).strict();

// prettier-ignore
const coverImageSchema = z.object(
  {
    altText: z.string(),
    urlSlug: z.string(),
  }
).strict();

// prettier-ignore
const categorySchema = z.object(
  {
    id: z.number(),
    categoryName: z.string(),
    categorySlug: z.string(),
    description: z.string().nullable(),
    coverImage: coverImageSchema.nullable(),
    posts: z.array(categoryPostSchema),
  }
).strict();

const allCategoriesSchema = z.array(categorySchema);

const newUpdateCategorySchema = categorySchema.omit({ posts: true });

// prettier-ignore
const deleteCategorySchema = z.object(
  {
    message: z.string(),
  }
).strict();

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/categories`);
    return allCategoriesSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOneCategory = async (categorySlug: string) => {
  try {
    const response = await axios.get(
      `${BACKEND_BASE_URL}/categories/${categorySlug}`
    );
    return categorySchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const postCategory = async (categoryData: unknown) => {
  try {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/categories`,
      categoryData
    );
    return newUpdateCategorySchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateCategory = async (
  urlSlug: string,
  categoryData: unknown
) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/categories/${urlSlug}`,
      categoryData
    );
    return newUpdateCategorySchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const deleteCategory = async (categorySlug: string) => {
  try {
    const response = await axios.delete(
      `${BACKEND_BASE_URL}/categories/${categorySlug}`
    );
    return deleteCategorySchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
