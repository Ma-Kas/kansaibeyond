import express from 'express';
import { Comment, User, Blog } from '../models';
import NotFoundError from '../errors/NotFoundError';
import {
  validateNewComment,
  validateNewRegisteredComment,
} from '../utils/input-validation';
import { NewComment, NewRegisteredComment } from '../types/types';
import BadRequestError from '../errors/BadRequestError';

const router = express.Router();

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/', async (_req, res, next) => {
  try {
    const allComments = await Comment.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'blogId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Blog,
          attributes: ['id', 'routeName'],
        },
      ],
    });
    res.status(200).json(allComments);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'blogId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Blog,
          attributes: ['id', 'routeName'],
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
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.post('/', async (req, res, next) => {
  try {
    let validatedCommentData: NewComment | NewRegisteredComment;

    // Get user from token
    const user = await User.findOne();

    // Split validation whether user is found (=logged in) or not
    // Different mandatory fields
    if (user) {
      validatedCommentData = validateNewRegisteredComment(req.body);
      if (!validatedCommentData) {
        throw new BadRequestError({ message: 'Invalid Comment data.' });
      }
      // Add userId
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
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.delete('/:id', async (req, res, next) => {
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
});

export default router;
