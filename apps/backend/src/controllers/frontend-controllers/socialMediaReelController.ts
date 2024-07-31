import { Request, Response, NextFunction } from 'express';

import { SocialMediaReel } from '../../models';

import NotFoundError from '../../errors/NotFoundError';

export const get_one_reel = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reel = await SocialMediaReel.findOne();

    if (!reel) {
      throw new NotFoundError({ message: 'Social Media Reel not found.' });
    }
    res.status(200).json(reel);
  } catch (err: unknown) {
    next(err);
  }
};
