import { Request, Response, NextFunction } from 'express';
import { Comment, User, Post } from '../models';
import NotFoundError from '../errors/NotFoundError';
import {
  validateNewComment,
  validateNewRegisteredComment,
} from '../utils/input-validation';
import { NewComment, NewRegisteredComment } from '../types/types';
import BadRequestError from '../errors/BadRequestError';

export const get_all_comments = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allComments = await Comment.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'postId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Post,
          attributes: ['id', 'postSlug'],
        },
      ],
    });
    res.status(200).json(allComments);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'postId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Post,
          attributes: ['id', 'postSlug'],
        },
      ],
    });
    if (!comment) {
      throw new NotFoundError({ message: 'Comment not found.' });
    }
    res.status(200).json(comment);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let validatedCommentData: NewComment | NewRegisteredComment;

    // Get user from token
    const user = await User.findOne();

    // Split validation whether user is found (=logged in) or not
    // Different mandatory fields
    if (user) {
      const validatedCommentDataExUser = validateNewRegisteredComment(req.body);

      if (!validatedCommentDataExUser) {
        throw new BadRequestError({ message: 'Invalid Comment data.' });
      }
      // Add userId
      validatedCommentData = validatedCommentDataExUser as NewRegisteredComment;
      validatedCommentData.userId = user.id;
    } else {
      validatedCommentData = validateNewComment(req.body);
      if (!validatedCommentData) {
        throw new BadRequestError({ message: 'Invalid Comment data.' });
      }
    }

    const addedComment = await Comment.create(validatedCommentData);
    res.status(201).json(addedComment);
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentToDelete = await Comment.findByPk(req.params.id);
    if (!commentToDelete) {
      throw new NotFoundError({ message: 'Comment to delete was not found.' });
    }

    await commentToDelete.destroy();
    res.status(200).json({ message: `Comment deleted` });
  } catch (err: unknown) {
    next(err);
  }
};