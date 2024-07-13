import { Request, Response, NextFunction } from 'express';
import { Tag, Post } from '../../models';

export const get_all_tags = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Post,
          attributes: ['id', 'postSlug'],
          through: {
            attributes: [],
          },
        },
      ],
      order: [['tagName', 'ASC']],
    });

    res.status(200).json(tags);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await Tag.findOne({
      where: { tagSlug: req.params.tagSlug },
      include: [
        {
          model: Post,
          attributes: ['id', 'postSlug'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.status(200).json(tag);
  } catch (err: unknown) {
    next(err);
  }
};
