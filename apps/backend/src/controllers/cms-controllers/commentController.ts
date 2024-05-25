import { Request, Response, NextFunction } from 'express';
import { Comment, User, Post } from '../../models';
import NotFoundError from '../../errors/NotFoundError';
import {
  validateNewComment,
  validateNewRegisteredComment,
} from '../../utils/validate-comment-data';
import { NewComment, NewRegisteredComment } from '../../types/types';
import BadRequestError from '../../errors/BadRequestError';
import { getSessionOrThrow } from '../../utils/get-session-or-throw';
import UnauthorizedError from '../../errors/UnauthorizedError';

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
      order: [['createdAt', 'DESC']],
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

    // Get userId from session
    const session = getSessionOrThrow(req);

    // Split validation whether user is found (=logged in) or not
    // Different mandatory fields
    if (session) {
      const validatedCommentDataExUser = validateNewRegisteredComment(req.body);

      if (!validatedCommentDataExUser) {
        throw new BadRequestError({ message: 'Invalid Comment data.' });
      }
      // Add userId
      validatedCommentData = validatedCommentDataExUser as NewRegisteredComment;
      validatedCommentData.userId = session.userId;
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
    const session = getSessionOrThrow(req);

    const commentToDelete = await Comment.findByPk(req.params.id);
    if (!commentToDelete) {
      throw new NotFoundError({ message: 'Comment to delete was not found.' });
    }

    if (
      session.status !== 'Admin' &&
      commentToDelete.userId !== session.userId
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    await commentToDelete.destroy();
    res.status(200).json({ message: `Comment deleted` });
  } catch (err: unknown) {
    next(err);
  }
};
