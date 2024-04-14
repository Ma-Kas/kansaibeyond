import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { User } from '../models';
import {
  validateNewUser,
  validateUserUpdate,
} from '../utils/validate-user-data';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

export const get_all_users = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

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
    });
    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = validateNewUser(req.body);
    if (newUser) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
      const addedUser = await User.create(newUser);
      res.status(201).json(addedUser);
    } else {
      throw new BadRequestError({ message: 'Invalid User data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToUpdate = await User.findOne({
      where: { username: req.params.username },
    });
    if (!userToUpdate) {
      throw new NotFoundError({ message: 'User to update was not found.' });
    }
    const userUpdateData = validateUserUpdate(req.body);
    if (userUpdateData) {
      // Only re-crypt password if password has changed
      if ('password' in userUpdateData) {
        userUpdateData.password = await bcrypt.hash(
          userUpdateData.password!,
          10
        );
      }
      const updatedUser = await User.update(userUpdateData, {
        where: { username: userToUpdate.username },
        returning: true,
      });
      res.status(200).json(updatedUser[1][0]);
    } else {
      // No update data => return original user
      res.status(204).send();
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToDelete = await User.findOne({
      where: { username: req.params.username },
    });
    if (!userToDelete) {
      throw new NotFoundError({ message: 'User to delete was not found.' });
    }

    await userToDelete.destroy();
    res
      .status(200)
      .json({ message: `Deleted user "${userToDelete.username}"` });
  } catch (err: unknown) {
    next(err);
  }
};
