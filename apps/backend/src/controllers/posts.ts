import express from 'express';

import { Post, Category, User, Comment } from '../models';
import { validateNewPost, validatePostUpdate } from '../utils/input-validation';
import { NewPost } from '../types/types';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

const router = express.Router();

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/', async (_req, res, next) => {
  try {
    const allPosts = await Post.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'categoryId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Category,
          attributes: ['categoryName'],
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'name'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    if (!allPosts) {
      throw new NotFoundError({ message: 'No posts found' });
    }

    res.status(200).json(allPosts);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/:routeName', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'userId',
          'categoryId',
          'routeName',
        ],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Category,
          attributes: ['categoryName'],
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'name'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
      where: { routeName: req.params.routeName },
    });
    if (!post) {
      throw new NotFoundError({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne();

    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }

    const validatedPostDataExUser = validateNewPost(req.body);

    if (validatedPostDataExUser) {
      const validatedPostData = validatedPostDataExUser as NewPost;
      validatedPostData.userId = user.id;

      const addedPost = await Post.create(validatedPostData);
      res.status(201).json(addedPost);
    } else {
      throw new BadRequestError({ message: 'Invalid Post data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.put('/:routeName', async (req, res, next) => {
  try {
    const postToUpdate = await Post.findOne({
      where: { routeName: req.params.routeName },
    });
    if (!postToUpdate) {
      throw new NotFoundError({ message: 'Post to update was not found.' });
    }
    const validatedUpdateData = validatePostUpdate(req.body);
    if (validatedUpdateData) {
      const updatedPost = await Post.update(validatedUpdateData, {
        where: { routeName: postToUpdate.routeName },
        returning: true,
      });
      res.status(200).json(updatedPost[1][0]);
    } else {
      // No update data => return original post
      res.status(204).send();
    }
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.delete('/:routeName', async (req, res, next) => {
  try {
    const postToDelete = await Post.findOne({
      where: { routeName: req.params.routeName },
    });
    if (!postToDelete) {
      throw new NotFoundError({ message: 'Post to delete was not found.' });
    }

    await postToDelete.destroy();
    res.status(200).json({ message: `Deleted ${postToDelete.routeName}` });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
