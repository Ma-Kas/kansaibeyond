import { Request, Response, NextFunction } from 'express';
import { addHours, hoursToMilliseconds, isFuture } from 'date-fns';
import { Session, User } from '../../models';
import {
  COOKIE_DOMAIN,
  COOKIE_SAME_SITE_POLICY,
  SESSION_DURATION_HOURS,
  SameSiteType,
} from '../../utils/config';
import NotFoundError from '../../errors/NotFoundError';
import UnauthorizedError from '../../errors/UnauthorizedError';

export const get_authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let cookie: string | undefined = undefined;

    if (
      'sessionId' in req.cookies &&
      typeof req.cookies.sessionId === 'string'
    ) {
      cookie = req.cookies.sessionId;
    }

    if (!cookie) {
      return res.status(200).json(null);
    }

    const validSession = await Session.findOne({
      where: { sessionId: cookie },
    });

    if (!validSession) {
      return res.status(200).json(null);
    }

    if (!isFuture(new Date(validSession.expiresAt))) {
      return res.status(200).json(null);
    }

    const user = await User.findOne({
      where: { id: validSession.userId },
      attributes: ['id', 'username', 'displayName', 'userIcon', 'role'],
    });

    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }

    if (user.disabled) {
      await Session.destroy({ where: { userId: user.id } });
      throw new UnauthorizedError({ message: 'Account disabled.' });
    }

    const renewedSessionId = crypto.randomUUID();

    // Update Session table renew session expiration
    await Session.update(
      {
        expiresAt: addHours(new Date(), SESSION_DURATION_HOURS),
        sessionId: renewedSessionId,
      },
      {
        where: { sessionId: validSession.sessionId },
      }
    );

    // Update cookie for renewed session
    res.cookie('sessionId', renewedSessionId, {
      maxAge: hoursToMilliseconds(SESSION_DURATION_HOURS),
      httpOnly: true,
      domain: COOKIE_DOMAIN,
      secure: true,
      sameSite: COOKIE_SAME_SITE_POLICY as SameSiteType, // Workaround for dev and Chrome's new cookie fuckery
    });

    return res.status(200).json(user);
  } catch (err: unknown) {
    return next(err);
  }
};
