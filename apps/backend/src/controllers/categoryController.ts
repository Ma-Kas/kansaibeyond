import { Request, Response, NextFunction } from 'express';

import { Category, Post } from '../models';
import {
  validateNewCategory,
  validateCategoryUpdate,
} from '../utils/validate-category-data';

import { MIN_CATEGORIES_PER_POST } from '../utils/constants';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import { sequelize } from '../utils/db';

export const get_all_categories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Post,
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).json(categories);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOne({
      where: { categorySlug: req.params.categorySlug },
    });
    if (!category) {
      throw new NotFoundError({ message: 'Category not found.' });
    }
    res.status(200).json(category);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = validateNewCategory(req.body);
    if (newCategory) {
      const addedCategory = await Category.create(newCategory);
      res.status(201).json(addedCategory);
    } else {
      throw new BadRequestError({ message: 'Invalid Category data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryToUpdate = await Category.findOne({
      where: { categorySlug: req.params.categorySlug },
    });
    if (!categoryToUpdate) {
      throw new NotFoundError({ message: 'Category to update was not found.' });
    }
    const categoryUpdateData = validateCategoryUpdate(req.body);

    if (!categoryUpdateData) {
      // No update data => return original category
      res.status(204).send();
    } else {
      const updatedCategory = await Category.update(categoryUpdateData, {
        where: { categorySlug: categoryToUpdate.categorySlug },
        returning: true,
      });
      res.status(200).json(updatedCategory[1][0]);
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();
  try {
    const categoryToDelete = await Category.findOne({
      where: { categorySlug: req.params.categorySlug },
    });
    if (!categoryToDelete) {
      throw new NotFoundError({ message: 'Category to delete was not found.' });
    }

    const postCount = await categoryToDelete.countPosts();

    // Category is associated with posts, check for each affected post, if it has
    // other categories associated with it
    if (postCount) {
      const posts = await categoryToDelete.getPosts();
      const blockingPosts = [];
      for (let i = 0; i < postCount; i++) {
        const categoryCount = await posts[i].countCategories();
        if (categoryCount === MIN_CATEGORIES_PER_POST) {
          blockingPosts.push(posts[i]);
        } else {
          await posts[i].removeCategory(categoryToDelete, {
            transaction: transaction,
          });
        }
      }
      // If categoryToDelete is only category for any post, block deletion,
      // list blockingPosts
      if (blockingPosts.length) {
        throw new BadRequestError({
          message: `Cannot delete. Category is only category in ${
            blockingPosts.length
          } posts. Affected posts: ${blockingPosts
            .map((post) => post.postSlug)
            .join(' | ')}`,
        });
      }
    }

    // Not associated posts that would block deletion
    await categoryToDelete.destroy({
      transaction: transaction,
    });
    await transaction.commit();
    res
      .status(200)
      .json({ message: `Deleted category "${categoryToDelete.categoryName}"` });
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};
