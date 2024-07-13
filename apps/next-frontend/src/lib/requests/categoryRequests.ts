import { z } from 'zod';
import { BACKEND_BASE_URL } from '@/config/constants';

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
  const response = await fetch(`${BACKEND_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Categories fetch error\n');
  }

  const data: unknown = await response.json();

  const parsedCategories = allCategoriesSchema.parse(data);
  return parsedCategories;
};

export const getOneCategory = async (categorySlug: string) => {
  const response = await fetch(
    `${BACKEND_BASE_URL}/categories/${categorySlug}`
  );

  if (!response.ok) {
    throw new Error('Category fetch error\n');
  }

  const data: unknown = await response.json();

  const parsedCategory = singleCategorySchema.parse(data);
  return parsedCategory;
};
