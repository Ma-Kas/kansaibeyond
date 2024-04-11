import { z } from 'zod';
import {
  NewUser,
  UpdateUser,
  NewPost,
  UpdatePost,
  CategoryExId,
  NewComment,
  Comment,
} from '../types/types';
import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

// Zod Schemas
const stringSchema = z.string();
const numberSchema = z.number();
const newUserSchema = z
  .object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    password: z.string(),
  })
  .strict();

const postMediaSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
});

const postTagSchema = z.array(z.string());

const newPostSchema = z
  .object({
    routeName: z.string(),
    title: z.string(),
    content: z.string(),
    media: postMediaSchema,
    tags: postTagSchema,
    categoryId: z.number(),
  })
  .strict();

const newCommentSchema = z.object({
  content: z.string(),
  name: z.string(),
  email: z.string().email(),
  postId: z.number(),
});

const newRegisteredCommentSchema = z.object({
  content: z.string(),
  postId: z.number(),
});

// Type Validation with Error Handling
const parseStringInput = (input: unknown, path: string): string => {
  const parseResult = stringSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.issues[0];
    // Path array of ZodError is empty, as only single string is parsed
    // thus manual path is passed as second argument to function
    throw new BadRequestError({
      message: `Validation error: ${error.message.toString()} at "${path}";`,
    });
  }
  return parseResult.data;
};

const parseNumberInput = (input: unknown, path: string): number => {
  const parseResult = numberSchema.safeParse(input);
  if (!parseResult.success) {
    const error = parseResult.error.issues[0];
    // Path array of ZodError is empty, as only single string is parsed
    // thus manual path is passed as second argument to function
    throw new BadRequestError({
      message: `Validation error: ${error.message.toString()} at "${path}";`,
    });
  }
  return parseResult.data;
};

// Exported Form Data Validators
const validateNewUser = (input: unknown): NewUser => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('username' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('firstName' in input)) {
    throw new BadRequestError({ message: 'First Name is required.' });
  }

  if (!('lastName' in input)) {
    throw new BadRequestError({ message: 'Last Name is required.' });
  }

  if (!('email' in input)) {
    throw new BadRequestError({ message: 'Email is required.' });
  }

  if (!('displayName' in input)) {
    throw new BadRequestError({ message: 'Username is required.' });
  }

  if (!('password' in input)) {
    throw new BadRequestError({ message: 'Password is required' });
  }

  return zodSchemaParser(newUserSchema, input);
};

const validateUserUpdate = (input: unknown): UpdateUser | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (
    !('username' in input) &&
    !('userIcon' in input) &&
    !('firstName' in input) &&
    !('lastName' in input) &&
    !('email' in input) &&
    !('displayName' in input) &&
    !('password' in input)
  ) {
    return null;
  }

  const updateData: UpdateUser = {};

  if ('username' in input) {
    updateData.username = parseStringInput(input.username, 'username');
  }

  if ('userIcon' in input) {
    updateData.userIcon = parseStringInput(input.userIcon, 'userIcon');
  }

  if ('firstName' in input) {
    updateData.firstName = parseStringInput(input.firstName, 'firstName');
  }

  if ('lastName' in input) {
    updateData.lastName = parseStringInput(input.lastName, 'lastName');
  }

  if ('email' in input) {
    updateData.email = parseStringInput(input.email, 'email');
  }

  if ('displayName' in input) {
    updateData.displayName = parseStringInput(input.displayName, 'displayName');
  }

  if ('password' in input) {
    updateData.password = parseStringInput(input.password, 'password');
  }

  return updateData;
};

const validateNewPost = (input: unknown): Omit<NewPost, 'userId'> => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('routeName' in input)) {
    throw new BadRequestError({ message: 'Route Name is required.' });
  }

  if (!('title' in input)) {
    throw new BadRequestError({ message: 'Post Title is required.' });
  }

  if (!('content' in input)) {
    throw new BadRequestError({ message: 'Post Content is required.' });
  }

  if (!('media' in input)) {
    throw new BadRequestError({ message: 'Media is required.' });
  }

  if (!('tags' in input)) {
    throw new BadRequestError({ message: 'Tags are required.' });
  }

  if (!('categoryId' in input)) {
    throw new BadRequestError({ message: 'Category Id is required.' });
  }

  return zodSchemaParser(newPostSchema, input);
};

const validatePostUpdate = (input: unknown): UpdatePost | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  // No update data present
  if (
    !('title' in input) &&
    !('content' in input) &&
    !('media' in input) &&
    !('tags' in input) &&
    !('categoryId' in input)
  ) {
    return null;
  }

  const updateData: UpdatePost = {};

  if ('title' in input) {
    updateData.title = parseStringInput(input.title, 'title');
  }

  if ('content' in input) {
    updateData.content = parseStringInput(input.content, 'content');
  }

  if ('media' in input) {
    updateData.media = zodSchemaParser(postMediaSchema, input);
  }

  if ('tags' in input) {
    updateData.tags = zodSchemaParser(postTagSchema, input);
  }

  if ('categoryId' in input) {
    updateData.categoryId = parseNumberInput(input.categoryId, 'categoryId');
  }

  return updateData;
};

const validateNewCategory = (input: unknown): CategoryExId => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('categoryName' in input)) {
    throw new BadRequestError({ message: 'CategoryName is required.' });
  }

  return {
    categoryName: parseStringInput(input.categoryName, 'categoryName'),
  };
};

const validateCategoryUpdate = (input: unknown): CategoryExId | null => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('categoryName' in input)) {
    return null;
  }

  return {
    categoryName: parseStringInput(input.categoryName, 'categoryName'),
  };
};

const validateNewComment = (input: unknown): NewComment => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('content' in input)) {
    throw new BadRequestError({ message: 'Content is required.' });
  }

  if (!('name' in input)) {
    throw new BadRequestError({ message: 'Name is required.' });
  }

  if (!('email' in input)) {
    throw new BadRequestError({ message: 'Email is required.' });
  }

  if (!('postId' in input)) {
    throw new BadRequestError({ message: 'Post Id is required.' });
  }

  return zodSchemaParser(newCommentSchema, input);
};

const validateNewRegisteredComment = (
  input: unknown
): Pick<Comment, 'content' | 'postId'> => {
  if (!input || !(typeof input === 'object')) {
    throw new BadRequestError({ message: 'Malformed input format.' });
  }

  if (!('content' in input)) {
    throw new BadRequestError({ message: 'Content is required.' });
  }

  if (!('postId' in input)) {
    throw new BadRequestError({ message: 'Post Id is required.' });
  }

  return zodSchemaParser(newRegisteredCommentSchema, input);
};

export {
  validateNewUser,
  validateUserUpdate,
  validateNewPost,
  validatePostUpdate,
  validateNewCategory,
  validateCategoryUpdate,
  validateNewComment,
  validateNewRegisteredComment,
};
