import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import {
  categorySchema,
  allCategoriesSchema,
  newUpdateCategorySchema,
  deleteOneSchema as deleteCategorySchema,
} from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

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
