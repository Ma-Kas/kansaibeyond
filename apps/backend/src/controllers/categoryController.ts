import { Request, Response, NextFunction } from 'express';

import { Category, Post } from '../models';
import {
  validateNewCategory,
  validateCategoryUpdate,
} from '../utils/validate-category-data';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

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
      where: { categoryName: req.params.categoryName },
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
      where: { categoryName: req.params.categoryName },
    });
    if (!categoryToUpdate) {
      throw new NotFoundError({ message: 'Category to update was not found.' });
    }
    const categoryUpdateData = validateCategoryUpdate(req.body);
    if (categoryUpdateData) {
      const updatedCategory = await Category.update(categoryUpdateData, {
        where: { categoryName: categoryToUpdate.categoryName },
        returning: true,
      });
      res.status(200).json(updatedCategory[1][0]);
    } else {
      // No update data => return original category
      res.status(204).send();
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
  try {
    const categoryToDelete = await Category.findOne({
      where: { categoryName: req.params.categoryName },
    });
    if (!categoryToDelete) {
      throw new NotFoundError({ message: 'Category to delete was not found.' });
    }

    const postCount = await categoryToDelete.countPosts();

    if (postCount) {
      throw new BadRequestError({
        message: `Cannot delete. Category is used in ${postCount} posts.`,
      });
    }

    await categoryToDelete.destroy();
    res
      .status(200)
      .json({ message: `Deleted category "${categoryToDelete.categoryName}"` });
  } catch (err: unknown) {
    next(err);
  }
};
