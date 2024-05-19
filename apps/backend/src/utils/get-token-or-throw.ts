import { Request } from 'express';
import jwt from 'jsonwebtoken';

import UnauthorizedError from '../errors/UnauthorizedError';
import { TokenType } from '../types/types';

const isJwtPayload = (value: unknown): value is jwt.JwtPayload => {
  return (value as jwt.JwtPayload).id !== undefined;
};

export const getTokenOrThrow = (req: Request) => {
  if (
    !('token' in req) ||
    typeof req.token === 'string' ||
    !isJwtPayload(req.token)
  ) {
    throw new UnauthorizedError({ message: 'Missing or invalid token.' });
  } else {
    return req.token as TokenType;
  }
};
