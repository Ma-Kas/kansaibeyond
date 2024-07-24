import { Request, Response, NextFunction } from 'express';

import { Affiliate, User } from '../../models';
import NotFoundError from '../../errors/NotFoundError';

export const get_all_affiliates = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const affiliates = await Affiliate.findAll({
      attributes: {
        exclude: ['userId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'displayName', 'userIcon', 'role'],
        },
      ],
      order: [['blogName', 'ASC']],
    });

    if (!affiliates) {
      throw new NotFoundError({ message: 'No affiliates found.' });
    }

    res.status(200).json(affiliates);
  } catch (err: unknown) {
    next(err);
  }
};
