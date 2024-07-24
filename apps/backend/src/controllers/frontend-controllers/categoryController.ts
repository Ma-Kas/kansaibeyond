import { Request, Response, NextFunction } from 'express';

import { Category, Post } from '../../models';
import NotFoundError from '../../errors/NotFoundError';

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
          attributes: ['id', 'postSlug'],
          through: {
            attributes: [],
          },
        },
      ],
      order: [['categoryName', 'ASC']],
    });

    if (!categories) {
      throw new NotFoundError({ message: 'No categories found' });
    }

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
      throw new NotFoundError({ message: 'No category found' });
    }

    res.status(200).json(category);
  } catch (err: unknown) {
    next(err);
  }
};
