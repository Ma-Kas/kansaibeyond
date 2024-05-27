import { Request, Response, NextFunction } from 'express';
import { addHours, hoursToMilliseconds, isFuture } from 'date-fns';
import { Session } from '../../models';
import { SESSION_DURATION_HOURS } from '../../utils/config';

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
      return res.status(200).json({ auth: false });
    }

    const validSession = await Session.findOne({
      where: { sessionId: cookie },
    });

    if (!validSession) {
      return res.status(200).json({ auth: false });
    }

    if (!isFuture(new Date(validSession.expiresAt))) {
      return res.status(200).json({ auth: false });
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
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    if (validSession.role === 'ADMIN') {
      return res.status(200).json({ auth: true, isAdmin: true });
    }
    return res.status(200).json({ auth: true });
  } catch (err: unknown) {
    return next(err);
  }
};
