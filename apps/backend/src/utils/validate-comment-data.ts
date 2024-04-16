import { z } from 'zod';
import { NewComment, Comment } from '../types/types';
import zodSchemaParser from './zod-schema-parser';
import BadRequestError from '../errors/BadRequestError';

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

export { validateNewComment, validateNewRegisteredComment };
