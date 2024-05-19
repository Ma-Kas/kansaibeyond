import { Request, Response, NextFunction } from 'express';
import { getTokenOrThrow } from '../../utils/get-token-or-throw';

import { Session } from '../../models';

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenOrThrow(req);

    await Session.destroy({ where: { userId: Number(token.id) } });

    res.status(204).json({ message: 'Session removed' });
  } catch (err: unknown) {
    next(err);
  }
};
