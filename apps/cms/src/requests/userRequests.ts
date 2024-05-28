import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const coverImageSchema = z.object(
  {
    altText: z.string(),
    urlSlug: z.string(),
  }
).strict();

// prettier-ignore
const postStatusSchema = z.union([
  z.literal('published'),
  z.literal('draft'),
  z.literal('pending'),
  z.literal('trash'),
]);

// prettier-ignore
const userPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string().optional(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    userId: z.number().optional(),
  }
).strict();

// prettier-ignore
const commentUserSchema = z.object(
  {
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: z.string(),
  }
).strict();

// prettier-ignore
const commentPostSchema = z.object(
  {
    id: z.number(),
    postSlug: z.string(),
  }
).strict();

// prettier-ignore
const userCommentSchema = z.object(
  {
    id: z.number(),
    content: z.string(),
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    user: commentUserSchema,
    post: commentPostSchema,
  }
).strict();

// prettier-ignore
const userContactSchema = z.object(
  {
    id: z.number(),
    email: z.string().email().nullable(),
    homepage: z.string().nullable(),
    twitter: z.string().nullable(),
    instagram: z.string().nullable(),
    youtube: z.string().nullable(),
    linkedin: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number(),
  }
).strict();

// prettier-ignore
const userSchema = z.object(
  {
    id: z.number(),
    username: z.string(),
    email: z.string(),
    displayName: z.string(),
    password: z.string(),
    userIcon: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    introduction: z.string().nullable(),
    role: z.string(),
    disabled: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    posts: z.array(userPostSchema),
    comments: z.array(userCommentSchema),
    contact: userContactSchema,
  }
).strict();

const newUserSchema = userSchema.omit({
  posts: true,
  comments: true,
  contact: true,
});

export const postUser = async (userData: unknown) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/users`, userData);
    return newUserSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};
