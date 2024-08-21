import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import {
  singleCategorySchema,
  allCategoriesSchema,
} from '@/types/request-schemas';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

export const getAllCategoriesList = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/categories`, {
      next: {
        tags: [REVALIDATION_TAGS.categories, REVALIDATION_TAGS.categoryUpdated],
      },
    });

    if (!response.ok) {
      throw new CustomError({
        digest: response.statusText,
        message: response.statusText,
      });
    }

    const data: unknown = await response.json();

    const parsedCategories = allCategoriesSchema.parse(data);
    return parsedCategories;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};

export const getOneCategory = async (categorySlug: string) => {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/categories/${categorySlug}`,
      { next: { tags: [categorySlug, REVALIDATION_TAGS.categoryUpdated] } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      } else {
        throw new CustomError({
          digest: response.statusText,
          message: response.statusText,
        });
      }
    }

    const data: unknown = await response.json();

    const parsedCategory = singleCategorySchema.parse(data);
    return parsedCategory;
  } catch (err: unknown) {
    return handleRequestErrors(err);
  }
};
