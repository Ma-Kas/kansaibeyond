import { Request, Response, NextFunction } from 'express';

import { Contact, User, Affiliate } from '../../models';

import NotFoundError from '../../errors/NotFoundError';

export const get_all_users = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await User.findAll({
      attributes: [
        'username',
        'displayName',
        'userIcon',
        'introduction',
        'role',
      ],
      include: [
        {
          model: Contact,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'userId'] },
        },
        { model: Affiliate, attributes: { exclude: ['id', 'userId'] } },
      ],
      order: [['displayName', 'ASC']],
    });

    if (!allUsers) {
      throw new NotFoundError({ message: 'No users found' });
    }

    res.status(200).json(allUsers);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: [
        'username',
        'displayName',
        'userIcon',
        'introduction',
        'role',
      ],
      include: [
        {
          model: Contact,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'userId'] },
        },
        { model: Affiliate, attributes: { exclude: ['id', 'userId'] } },
      ],
      order: [['displayName', 'ASC']],
    });
    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err: unknown) {
    next(err);
  }
};
