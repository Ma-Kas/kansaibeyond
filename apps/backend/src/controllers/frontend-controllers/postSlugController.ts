import { Request, Response, NextFunction } from 'express';
import { Post } from '../../models';

import NotFoundError from '../../errors/NotFoundError';

export const get_post_slug_list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPosts = await Post.findAll({
      where: { status: 'published' },
      attributes: ['postSlug'],
    });

    if (!allPosts) {
      throw new NotFoundError({ message: 'No posts found' });
    }

    res.status(200).json(allPosts);
  } catch (err: unknown) {
    next(err);
  }
};
