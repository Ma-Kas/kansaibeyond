import { Request, Response, NextFunction } from 'express';

import { Affiliate, User } from '../../models';
import {
  validateNewAffiliate,
  validateAffiliateUpdate,
} from '../../utils/validate-affiliate-data';
import NotFoundError from '../../errors/NotFoundError';
import BadRequestError from '../../errors/BadRequestError';

export const get_all_affiliates = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const affiliates = await Affiliate.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'displayName', 'userIcon', 'role'],
        },
      ],
      order: [['blogName', 'ASC']],
    });

    res.status(200).json(affiliates);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_affiliate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const affiliate = await Affiliate.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['username', 'displayName', 'userIcon', 'role'],
        },
      ],
    });
    if (!affiliate) {
      throw new NotFoundError({ message: 'Affiliate not found.' });
    }

    res.status(200).json(affiliate);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_affiliate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newAffiliate = validateNewAffiliate(req.body);
    if (newAffiliate) {
      const addedAffiliate = await Affiliate.create(newAffiliate);
      res.status(201).json(addedAffiliate);
    } else {
      throw new BadRequestError({ message: 'Invalid Affiliate data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_affiliate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const affiliateToUpdate = await Affiliate.findOne({
      where: { id: req.params.id },
    });
    if (!affiliateToUpdate) {
      throw new NotFoundError({
        message: 'Affiliate to update was not found.',
      });
    }

    const affiliateUpdateData = validateAffiliateUpdate(req.body);

    if (!affiliateUpdateData) {
      // No update data => return original affiliate
      res.status(204).send();
    } else {
      const updatedAffiliate = await Affiliate.update(affiliateUpdateData, {
        where: { id: affiliateToUpdate.id },
        returning: true,
      });
      res.status(200).json(updatedAffiliate[1][0]);
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_affiliate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const affiliateToDelete = await Affiliate.findOne({
      where: { id: req.params.id },
    });
    if (!affiliateToDelete) {
      throw new NotFoundError({
        message: 'Affiliate to delete was not found.',
      });
    }

    await affiliateToDelete.destroy();
    res.status(200).json({
      message: `Deleted affiliate blog: "${affiliateToDelete.blogName}"`,
    });
  } catch (err: unknown) {
    next(err);
  }
};
