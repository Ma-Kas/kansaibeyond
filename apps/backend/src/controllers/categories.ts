import express from 'express';

import { Category } from '../models';
import {
  validateNewCategory,
  validateCategoryUpdate,
} from '../utils/input-validation';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

const router = express.Router();

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json(categories);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/:categoryName', async (req, res, next) => {
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
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.post('/', async (req, res, next) => {
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
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.put('/:categoryName', async (req, res, next) => {
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
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.delete('/:categoryName', async (req, res, next) => {
  try {
    const categoryToDelete = await Category.findOne({
      where: { categoryName: req.params.categoryName },
    });
    if (!categoryToDelete) {
      throw new NotFoundError({ message: 'Category to delete was not found.' });
    }

    await categoryToDelete.destroy();
    res
      .status(200)
      .json({ message: `Deleted ${categoryToDelete.categoryName}` });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
