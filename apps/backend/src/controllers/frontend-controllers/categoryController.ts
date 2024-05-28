import { Request, Response, NextFunction } from 'express';

import { Category, Post } from '../../models';

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

    res.status(200).json(categories);
  } catch (err: unknown) {
    next(err);
  }
};
