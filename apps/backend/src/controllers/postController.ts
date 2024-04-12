import { Request, Response, NextFunction } from 'express';

import { Post, Category, User, Comment } from '../models';
import { validateNewPost, validatePostUpdate } from '../utils/input-validation';
import { NewPost } from '../types/types';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

export const get_all_posts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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
          through: {
            attributes: [],
          },
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
};

export const get_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'categoryId', 'postSlug'],
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
      where: { postSlug: req.params.postSlug },
    });
    if (!post) {
      throw new NotFoundError({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne();

    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }

    // TODO: Clean up this mess here in terms of typing
    const validatedPostDataExUser = validateNewPost(req.body);

    if (validatedPostDataExUser) {
      const validatedPostData = validatedPostDataExUser as NewPost;
      validatedPostData.userId = user.id;

      const addedPost = await Post.create(validatedPostData);

      // This here will crash if categories that are being associated don't exist
      // Add safeguard against it
      await addedPost.addCategories(validatedPostDataExUser.categories);
      res.status(201).json(addedPost);
    } else {
      throw new BadRequestError({ message: 'Invalid Post data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postToUpdate = await Post.findOne({
      where: { postSlug: req.params.postSlug },
    });
    if (!postToUpdate) {
      throw new NotFoundError({ message: 'Post to update was not found.' });
    }
    const validatedUpdateData = validatePostUpdate(req.body);
    if (validatedUpdateData) {
      const updatedPost = await Post.update(validatedUpdateData, {
        where: { postSlug: postToUpdate.postSlug },
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
};

export const delete_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postToDelete = await Post.findOne({
      where: { postSlug: req.params.postSlug },
    });
    if (!postToDelete) {
      throw new NotFoundError({ message: 'Post to delete was not found.' });
    }

    await postToDelete.destroy();
    res.status(200).json({ message: `Deleted ${postToDelete.postSlug}` });
  } catch (err: unknown) {
    next(err);
  }
};
