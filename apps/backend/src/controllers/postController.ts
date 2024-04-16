import { Request, Response, NextFunction } from 'express';

import { Post, Category, User, Comment, Tag } from '../models';
import {
  validateNewPostData,
  validatePostUpdateData,
} from '../utils/validate-post-data';
import { NewPost } from '../types/types';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { sequelize } from '../utils/db';

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
          model: Post,
          as: 'relatedPosts',
          attributes: ['id', 'title'],
          through: {
            attributes: [],
          },
        },
        {
          model: Category,
          attributes: ['id', 'categoryName'],
          through: {
            attributes: [],
          },
        },
        {
          model: Tag,
          attributes: ['id', 'tagName'],
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
          through: {
            attributes: [],
          },
        },
        {
          model: Tag,
          attributes: ['tagName'],
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
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne();

    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }

    // Validated raw data
    const validatedData = validateNewPostData(req.body);

    if (validatedData) {
      // Add user_id from logged in user to validated data
      const validatedPostData = validatedData.postData as NewPost;
      validatedPostData.userId = user.id;

      const addedPost = await Post.create(validatedPostData, {
        transaction: transaction,
      });

      // Add association to categories, tags table
      await addedPost.addCategories(validatedData.categories, {
        transaction: transaction,
      });
      await addedPost.addTags(validatedData.tags, {
        transaction: transaction,
      });
      if (validatedData.relatedPosts) {
        await addedPost.addRelatedPosts(validatedData.relatedPosts, {
          transaction: transaction,
        });
      }
      await transaction.commit();
      res.status(201).json(addedPost);
    } else {
      throw new BadRequestError({ message: 'Invalid Post data.' });
    }
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};

export const update_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();
  try {
    const postToUpdate = await Post.findOne({
      where: { postSlug: req.params.postSlug },
      transaction: transaction,
    });
    if (!postToUpdate) {
      throw new NotFoundError({ message: 'Post to update was not found.' });
    }
    const validatedUpdateData = validatePostUpdateData(req.body);

    // No update data => return original post
    if (!validatedUpdateData) {
      await transaction.rollback();
      res.status(204).send();
    } else {
      if (!validatedUpdateData.postData) {
        // No actual postdata to update, but only associations, then all queries
        // to posts table itself unneccessary
        if (validatedUpdateData.categories) {
          await postToUpdate.setCategories(validatedUpdateData.categories, {
            transaction: transaction,
          });
        }
        if (validatedUpdateData.tags) {
          await postToUpdate.setTags(validatedUpdateData.tags, {
            transaction: transaction,
          });
        }
        if (validatedUpdateData.relatedPosts) {
          await postToUpdate.setRelatedPosts(validatedUpdateData.relatedPosts, {
            transaction: transaction,
          });
        }
        await transaction.commit();
        res.status(200).json(postToUpdate);
      } else {
        const updatedPost = await Post.update(validatedUpdateData.postData, {
          where: { postSlug: postToUpdate.postSlug },
          transaction: transaction,
          returning: true,
        });
        // Set associated categories to updated categories
        if (validatedUpdateData.categories) {
          await updatedPost[1][0].setCategories(
            validatedUpdateData.categories,
            {
              transaction: transaction,
            }
          );
        }
        // Set associated tags to updated tags
        if (validatedUpdateData.tags) {
          await updatedPost[1][0].setTags(validatedUpdateData.tags, {
            transaction: transaction,
          });
        }
        // Set associated relatedPosts to updated relatedPosts
        if (validatedUpdateData.relatedPosts) {
          await updatedPost[1][0].setRelatedPosts(
            validatedUpdateData.relatedPosts,
            {
              transaction: transaction,
            }
          );
        }
        await transaction.commit();
        res.status(200).json(updatedPost[1][0]);
      }
    }
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};

export const trash_one_post = async (
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

    if (postToDelete.status === 'trash') {
      res.status(204).end();
    }

    const updatedPost = await Post.update(
      { status: 'trash' },
      {
        where: { postSlug: postToDelete.postSlug },
        returning: true,
      }
    );
    res
      .status(200)
      .json({ message: `Trashed post "${updatedPost[1][0].title}"` });
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();
  try {
    const postToDelete = await Post.findOne({
      where: { postSlug: req.params.postSlug },
    });
    if (!postToDelete) {
      throw new NotFoundError({ message: 'Post to delete was not found.' });
    }

    // If post is not trashed yet, just trash instead of deleting outright
    if (postToDelete.status !== 'trash') {
      const updatedPost = await Post.update(
        { status: 'trash' },
        {
          where: { postSlug: postToDelete.postSlug },
          transaction: transaction,
          returning: true,
        }
      );
      await transaction.commit();
      res
        .status(200)
        .json({ message: `Trashed post "${updatedPost[1][0].title}"` });
    } else {
      // Remove all associated categories, tags, relatedPosts by setting to empty array
      await postToDelete.setCategories([], {
        transaction: transaction,
      });
      await postToDelete.setTags([], {
        transaction: transaction,
      });
      await postToDelete.setRelatedPosts([], {
        transaction: transaction,
      });

      if (req.query.force && req.query.force === 'true') {
        await postToDelete.destroy({ force: true, transaction: transaction });
      } else {
        await postToDelete.destroy({
          transaction: transaction,
        });
      }
      await transaction.commit();
      res.status(200).json({ message: `Deleted post "${postToDelete.title}"` });
    }
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};
