import { Request, Response, NextFunction } from 'express';
import { addHours, hoursToMilliseconds } from 'date-fns';
import bcrypt from 'bcryptjs';
import { User, Session } from '../../models';
import { validateLoginData } from '../../utils/validate-login-data';
import NotFoundError from '../../errors/NotFoundError';
import UnauthorizedError from '../../errors/UnauthorizedError';
import { SESSION_DURATION_HOURS } from '../../utils/config';

export const post_login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const sessionId = crypto.randomUUID();

    // Create entry for current session in sessions table
    await Session.create({
      sessionId: sessionId,
      userId: user.id,
      status: user.status,
      expiresAt: addHours(new Date(), SESSION_DURATION_HOURS),
    });

    // Send cookie for session
    res.cookie('sessionId', sessionId, {
      maxAge: hoursToMilliseconds(SESSION_DURATION_HOURS),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    res.status(200).send({ username: user.username });
  } catch (err: unknown) {
    next(err);
  }
};
