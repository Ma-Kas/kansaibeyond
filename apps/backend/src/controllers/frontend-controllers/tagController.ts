import { Request, Response, NextFunction } from 'express';
import { Tag, Post } from '../../models';
import NotFoundError from '../../errors/NotFoundError';

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

    if (!tags) {
      throw new NotFoundError({ message: 'No tags found' });
    }

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
    if (!tag) {
      throw new NotFoundError({ message: 'Tag not found.' });
    }
    res.status(200).json(tag);
  } catch (err: unknown) {
    next(err);
  }
};
