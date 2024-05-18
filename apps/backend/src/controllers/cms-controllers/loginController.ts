import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../models';
import { JWT_TOKEN_SECRET } from '../../utils/config';
import { validateLoginData } from '../../utils/validate-login-data';
import NotFoundError from '../../errors/NotFoundError';
import UnauthorizedError from '../../errors/UnauthorizedError';

export const post_login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!JWT_TOKEN_SECRET) {
      throw new Error('JWT_TOKEN_SECRET not found in env');
    }

    const loginData = validateLoginData(req.body);
    const user = await User.findOne({
      where: { username: loginData.username },
    });
    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }

    if (user.disabled) {
      throw new UnauthorizedError({
        message: 'Account disabled.',
      });
    }

    const matchingPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!matchingPassword) {
      throw new UnauthorizedError({ message: 'Wrong password.' });
    }

    // Create the token for the session
    const userForToken = {
      id: user.id,
      status: user.status,
    };

    const token = jwt.sign(userForToken, JWT_TOKEN_SECRET, {
      expiresIn: '7 days',
    });

    // Create entry for current token in sessions table
    // await Session.create({ token: token, userId: user.id });

    res.status(200).send({ token, username: user.username });
  } catch (err: unknown) {
    next(err);
  }
};
