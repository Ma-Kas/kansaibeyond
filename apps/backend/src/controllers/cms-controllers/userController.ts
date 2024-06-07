import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { Comment, Contact, Post, Session, User } from '../../models';
import {
  validateNewUser,
  validateUserUpdate,
} from '../../utils/validate-user-data';

import BadRequestError from '../../errors/BadRequestError';
import NotFoundError from '../../errors/NotFoundError';
import { sequelize } from '../../utils/db';
import { getSessionOrThrow } from '../../utils/get-session-or-throw';
import UnauthorizedError from '../../errors/UnauthorizedError';
import {
  hasAdminPermission,
  hasOwnerPermission,
} from '../../utils/permission-group-handler';

export const get_all_users = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = getSessionOrThrow(req);

    if (!hasAdminPermission(session.role)) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    const allUsers = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{ model: Post }, { model: Comment }, { model: Contact }],
      order: [['displayName', 'ASC']],
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
    const session = getSessionOrThrow(req);
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{ model: Post }, { model: Comment }, { model: Contact }],
    });
    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }

    if (!hasAdminPermission(session.role) && session.userId !== user.id) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    if (hasOwnerPermission(user.role) && !hasOwnerPermission(session.role)) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
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
      await addedUser.createContact();
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
  const transaction = await sequelize.transaction();
  try {
    const session = getSessionOrThrow(req);
    const userToUpdate = await User.findOne({
      where: { username: req.params.username },
      transaction: transaction,
    });
    if (!userToUpdate) {
      throw new NotFoundError({ message: 'User to update was not found.' });
    }
    if (
      !hasAdminPermission(session.role) &&
      session.userId !== userToUpdate.id
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }
    if (
      hasOwnerPermission(userToUpdate.role) &&
      !hasOwnerPermission(session.role)
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    const userUpdateData = validateUserUpdate(req.body);
    // No update data => return original user
    if (!userUpdateData) {
      await transaction.rollback();
      res.status(204).send();
    } else {
      // Disallow disabling users or changing user role if not admin
      if (!hasAdminPermission(session.role) && 'disabled' in userUpdateData) {
        throw new UnauthorizedError({
          message: 'ADMIN permission required',
        });
      }
      if (!hasAdminPermission(session.role) && 'role' in userUpdateData) {
        throw new UnauthorizedError({
          message: 'ADMIN permission required',
        });
      }
      // Only re-crypt password if password has changed
      if (userUpdateData.password) {
        userUpdateData.password = await bcrypt.hash(
          userUpdateData.password,
          10
        );
      }
      const updatedUser = await User.update(userUpdateData, {
        where: { username: userToUpdate.username },
        transaction: transaction,
        returning: true,
      });
      // Update contact table entry if contact data in update data
      if (userUpdateData.contact) {
        await Contact.update(userUpdateData.contact, {
          where: { userId: userToUpdate.id },
          transaction: transaction,
        });
      }

      // Update Session table to reflect new role if user role changed
      if (userUpdateData.role) {
        await Session.update(
          { role: userUpdateData.role },
          {
            where: { userId: userToUpdate.id },
            transaction: transaction,
          }
        );
      }

      // Revoke sessions
      if (updatedUser[1][0].disabled) {
        await Session.destroy({
          where: { userId: Number(userToUpdate.id) },
          transaction: transaction,
        });
      }
      await transaction.commit();
      res.status(200).json(updatedUser[1][0]);
    }
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};

export const delete_one_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();
  try {
    const session = getSessionOrThrow(req);
    const userToDelete = await User.findOne({
      where: { username: req.params.username },
    });
    if (!userToDelete) {
      throw new NotFoundError({ message: 'User to delete was not found.' });
    }
    if (
      !hasAdminPermission(session.role) &&
      session.userId !== userToDelete.id
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    if (
      hasOwnerPermission(userToDelete.role) &&
      !hasOwnerPermission(session.role)
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    // Get associated contact row in contact table to delete along with user
    const contactToDelete = await Contact.findOne({
      where: { userId: userToDelete.id },
      transaction: transaction,
    });
    await contactToDelete?.destroy({
      transaction: transaction,
    });

    // Revoke session
    await Session.destroy({
      where: { userId: Number(userToDelete.id) },
      transaction: transaction,
    });

    if (req.query.force && req.query.force === 'true') {
      await userToDelete.destroy({ force: true, transaction: transaction });
    } else {
      await userToDelete.destroy({
        transaction: transaction,
      });
    }

    await transaction.commit();
    res
      .status(200)
      .json({ message: `Deleted user "${userToDelete.username}"` });
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};
