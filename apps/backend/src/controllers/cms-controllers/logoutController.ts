import { Request, Response, NextFunction } from 'express';
import { getSessionOrThrow } from '../../utils/get-session-or-throw';

import { Session } from '../../models';

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = getSessionOrThrow(req);

    await Session.destroy({ where: { userId: Number(session.userId) } });

    res.status(204).json({ message: 'Session removed' });
  } catch (err: unknown) {
    next(err);
  }
};