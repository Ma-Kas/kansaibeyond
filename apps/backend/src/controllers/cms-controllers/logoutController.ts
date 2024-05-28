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

    // Clear session cookie
    res.clearCookie('sessionId', {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    await Session.destroy({ where: { userId: Number(session.userId) } });

    res.status(204).end();
  } catch (err: unknown) {
    next(err);
  }
};
