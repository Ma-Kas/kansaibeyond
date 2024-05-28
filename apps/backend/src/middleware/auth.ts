import { Request, Response, NextFunction } from 'express';
import { isFuture } from 'date-fns';

import { Session, User } from '../models';
import UnauthorizedError from '../errors/UnauthorizedError';

interface AuthorizationRequest extends Request {
  session: Session;
}

const auth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let cookie: string | undefined = undefined;

    if (
      'sessionId' in req.cookies &&
      typeof req.cookies.sessionId === 'string'
    ) {
      cookie = req.cookies.sessionId;
    }

    if (!cookie) {
      throw new UnauthorizedError({ message: 'Session cookie not found.' });
    }

    const validSession = await Session.findOne({
      where: { sessionId: cookie },
      include: [
        {
          model: User,
          attributes: ['disabled'],
        },
      ],
    });

    if (!validSession) {
      throw new UnauthorizedError({ message: 'Session not found.' });
    }

    if (!isFuture(new Date(validSession.expiresAt))) {
      throw new UnauthorizedError({ message: 'Session expired' });
    }

    (req as AuthorizationRequest).session = validSession;

    return next();
  } catch (err) {
    next(err);
  }
};

export { auth };
