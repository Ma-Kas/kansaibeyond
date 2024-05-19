import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_TOKEN_SECRET } from '../utils/config';
import { Session } from '../models';
import UnauthorizedError from '../errors/UnauthorizedError';

interface AuthorizationRequest extends Request {
  token: string | jwt.JwtPayload;
}

const tokenExtractor = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError({ message: 'Invalid authorization header.' });
    }

    const validSession = await Session.findOne({
      where: { token: token },
    });

    if (!validSession) {
      throw new UnauthorizedError({ message: 'Invalid Session Token' });
    }

    if (!JWT_TOKEN_SECRET) {
      throw new Error('JWT_TOKEN_SECRET missing in env.');
    }

    const decoded = jwt.verify(token, JWT_TOKEN_SECRET);
    (req as AuthorizationRequest).token = decoded;

    return next();
  } catch (err) {
    next(err);
  }
};

export { tokenExtractor };
