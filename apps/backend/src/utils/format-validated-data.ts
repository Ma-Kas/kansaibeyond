// Format validated request data before passing to database
// Mainly to stringify objects, arrays

import { NewBlog, UpdateBlog } from '../types/types';

// Type declarations
type NewBlogFormatted = {
  title: string;
  content: string;
  media: string;
  tags: string;
  userId?: number;
  categoryId: number;
};

type UpdateBlogFormatted = {
  title?: string;
  content?: string;
  media?: string;
  tags?: string;
  categoryId?: number;
};

const formatNewBlogData = (input: NewBlog): NewBlogFormatted => {
  return {
    title: input.title,
    content: input.content,
    media: JSON.stringify(input.media),
    tags: JSON.stringify(input.tags),
    categoryId: input.categoryId,
  };
};

const formatUpdateBlogData = (input: UpdateBlog): UpdateBlogFormatted => {
  const updateData: UpdateBlogFormatted = {};

  if ('title' in input) {
    updateData.title = input.title;
  }

  if ('content' in input) {
    updateData.content = input.content;
  }

  if ('media' in input) {
    updateData.media = JSON.stringify(input.media);
  }

  if ('tags' in input) {
    updateData.tags = JSON.stringify(input.tags);
  }

  if ('categoryId' in input) {
    updateData.categoryId = input.categoryId;
  }

  return updateData;
};

export { formatNewBlogData, formatUpdateBlogData };
