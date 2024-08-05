import { createFormContext } from '@mantine/form';

type PostFormValues = {
  title: string;
  postSlug: string;
  content: string;
  coverImage: {
    urlSlug: string;
    altText: string;
  };
  status: 'published' | 'draft' | 'pending' | 'trash';
  readTime: number;
  categories: number[];
  tags: number[];
  relatedPosts: null | number[];
};

export const [PostFormProvider, usePostFormContext, usePostForm] =
  createFormContext<PostFormValues>();
