import { Request, Response, NextFunction } from 'express';

import { Affiliate, User } from '../../models';

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
