import { Request } from 'express';

import UnauthorizedError from '../errors/UnauthorizedError';
import { Session } from '../models';

export const getSessionOrThrow = (req: Request) => {
  if (!('session' in req) || typeof req.session === 'string') {
    throw new UnauthorizedError({ message: 'Session error' });
  } else {
    return req.session as Session;
  }
};
