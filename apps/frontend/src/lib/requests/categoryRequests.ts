import { z } from 'zod';
import { notFound } from 'next/navigation';
import { BACKEND_BASE_URL, REVALIDATION_TAGS } from '@/config/constants';
import { handleRequestErrors } from '@/utils/backend-error-response-validation';
import CustomError from '@/utils/custom-error';

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

export type Category = z.infer<typeof categorySchema>;

const allCategoriesSchema = z.array(categorySchema);
const singleCategorySchema = categorySchema.omit({ posts: true });

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
