import { Request, Response, NextFunction } from 'express';
import { isFuture } from 'date-fns';

import { Session, User } from '../models';
import ForbiddenError from '../errors/ForbiddenError';

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
      throw new ForbiddenError({ message: 'Session cookie not found.' });
    }

    const validSession = await Session.findOne({
      where: { sessionId: cookie },
      include: [
        {
          model: User,
          attributes: ['disabled'],
          where: { disabled: false },
        },
      ],
    });

    if (!validSession) {
      throw new ForbiddenError({ message: 'Session not found.' });
    }

    if (!isFuture(new Date(validSession.expiresAt))) {
      throw new ForbiddenError({ message: 'Session expired.' });
    }

    (req as AuthorizationRequest).session = validSession;

    return next();
  } catch (err) {
    next(err);
  }
};

export { auth };
