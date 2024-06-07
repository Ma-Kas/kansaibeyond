import { Request, Response, NextFunction } from 'express';

import { getSessionOrThrow } from '../utils/get-session-or-throw';
import UnauthorizedError from '../errors/UnauthorizedError';
import { hasAdminPermission } from '../utils/permission-group-handler';

const adminAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const session = getSessionOrThrow(req);

    if (!session) {
      throw new UnauthorizedError({ message: 'Session not found.' });
    }

    if (!hasAdminPermission(session.role)) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    return next();
  } catch (err) {
    next(err);
  }
};

export { adminAuth };
