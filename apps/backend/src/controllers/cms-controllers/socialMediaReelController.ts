import { Request, Response, NextFunction } from 'express';

import { SocialMediaReel } from '../../models';
import {
  validateNewSocialMediaReel,
  validateUpdateReel,
} from '../../utils/validate-social-media-reel-data';

import NotFoundError from '../../errors/NotFoundError';
import BadRequestError from '../../errors/BadRequestError';

export const get_all_reels = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reels = await SocialMediaReel.findAll({
      order: [['categoryName', 'ASC']],
    });

    res.status(200).json(reels);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_reel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reel = await SocialMediaReel.findOne({
      where: { id: req.params.id },
    });

    if (!reel) {
      throw new NotFoundError({ message: 'Social Media Reel not found.' });
    }
    res.status(200).json(reel);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_reel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newReel = validateNewSocialMediaReel(req.body);
    if (newReel) {
      const addedReel = await SocialMediaReel.create(newReel);
      res.status(201).json(addedReel);
    } else {
      throw new BadRequestError({ message: 'Invalid Social Media Reel data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_reel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reelToUpdate = await SocialMediaReel.findOne({
      where: { id: req.params.id },
    });
    if (!reelToUpdate) {
      throw new NotFoundError({ message: 'Reel to update was not found.' });
    }
    const reelUpdateData = validateUpdateReel(req.body);

    if (!reelUpdateData) {
      // No update data => return original reel
      res.status(204).send();
    } else {
      const updatedReel = await SocialMediaReel.update(reelUpdateData, {
        where: { id: reelToUpdate.id },
        returning: true,
      });
      res.status(200).json(updatedReel[1][0]);
    }
  } catch (err: unknown) {
    next(err);
  }
};
