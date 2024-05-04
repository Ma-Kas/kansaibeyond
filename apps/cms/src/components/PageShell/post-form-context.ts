import { createFormContext } from '@mantine/form';

type PostFormValues = {
  title: string;
  postSlug: string;
  content: string;
  coverImage: {
    urlSlug: string;
    altText: string;
  };
  categories: null | number[];
  tags: null | number[];
  relatedPosts: null | number[];
};

export const [PostFormProvider, usePostFormContext, usePostForm] =
  createFormContext<PostFormValues>();
