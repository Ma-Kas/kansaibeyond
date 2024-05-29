import { Request, Response, NextFunction } from 'express';
import { getSessionOrThrow } from '../../utils/get-session-or-throw';

import { Session } from '../../models';
import { COOKIE_SAME_SITE_POLICY, SameSiteType } from '../../utils/config';

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
      sameSite: COOKIE_SAME_SITE_POLICY as SameSiteType, // Workaround for dev and Chrome's new cookie fuckery
    });

    await Session.destroy({ where: { userId: Number(session.userId) } });

    res.status(204).end();
  } catch (err: unknown) {
    next(err);
  }
};
